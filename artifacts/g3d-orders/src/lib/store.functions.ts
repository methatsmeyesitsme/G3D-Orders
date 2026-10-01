import { createServerFn } from "@tanstack/react-start";
import { db, g3dCatalogState, g3dStoreOrders } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { DEFAULT_COLORS, DEFAULT_FIRMNESS, DEFAULT_SHAPES, DEFAULT_TEXTURE } from "@/lib/catalog-defaults";
import { assertStoreAccess } from "@/lib/store-access.server";
import type { G3dpgConfig, Order, OrderItem, OrderStatus, Product, ProductLine } from "@/lib/types";
import { newId } from "@/lib/utils";
import localCatalog from "../../data/catalog.json";

const ADMIN_CODE = process.env.G3D_ADMIN_PASSCODE?.trim() || "2004051315";
const GH_TOKEN = process.env.G3D_GITHUB_TOKEN?.trim();
const GH_OWNER = process.env.G3D_GITHUB_OWNER?.trim() || "methatsmeyesitsme";
const GH_REPO = process.env.G3D_GITHUB_REPO?.trim() || "G3D-Orders";
const GH_BRANCH = process.env.G3D_GITHUB_BRANCH?.trim() || "main";
const API = "https://api.github.com";
const CATALOG_PATH = "data/catalog.json";

type Catalog = { lines: ProductLine[]; products: Product[] };

function assertAdminAccess(code: string) { if (code !== ADMIN_CODE) throw new Error("Admin access denied"); }

function ghHeaders(): Record<string,string> {
  const h: Record<string,string> = { Accept:"application/vnd.github+json", "X-GitHub-Api-Version":"2022-11-28", "User-Agent":"G3D-Orders" };
  if (GH_TOKEN) h.Authorization = `Bearer ${GH_TOKEN}`;
  return h;
}
async function ghJson<T>(path:string, init?:RequestInit):Promise<T> {
  const res = await fetch(API + `/repos/${GH_OWNER}/${GH_REPO}${path}`, {
    ...init,
    headers: { ...ghHeaders(), ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`GitHub storage error ${res.status}: ${await res.text()}`);
  return await res.json() as T;
}
function decodeGithubContent(content:string) { return Buffer.from(content.replace(/\s/g,""),"base64").toString("utf8"); }
async function getGithubFile(path:string) { return ghJson<{content:string;sha:string}>(`/contents/${path}?ref=${encodeURIComponent(GH_BRANCH)}`); }
async function readCatalog():Promise<Catalog> {
  assertStoreAccess();
  const [saved] = await db.select({ catalog: g3dCatalogState.catalog })
    .from(g3dCatalogState)
    .where(eq(g3dCatalogState.id, "primary"))
    .limit(1);
  if (saved) return saved.catalog as unknown as Catalog;
  try {
    return JSON.parse(decodeGithubContent((await getGithubFile(CATALOG_PATH)).content)) as Catalog;
  } catch {
    return localCatalog as unknown as Catalog;
  }
}
async function writeCatalog(catalog:Catalog,_message:string) {
  await db.insert(g3dCatalogState)
    .values({ id: "primary", catalog })
    .onConflictDoUpdate({
      target: g3dCatalogState.id,
      set: { catalog, updatedAt: new Date() },
    });
}
async function nextOrderNumber() {
  const rows = await db.select({ orderNumber: g3dStoreOrders.orderNumber })
    .from(g3dStoreOrders);
  const used = new Set(rows.map((row) => row.orderNumber));
  const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for(let attempt=0;attempt<50;attempt++) {
    let suffix=""; for(let i=0;i<6;i++) suffix+=alphabet[Math.floor(Math.random()*alphabet.length)];
    const number=`G3D-${suffix}`; if(!used.has(number)) return number;
  }
  return `G3D-${Date.now().toString(36).toUpperCase()}`;
}
function mapProduct(p:Product,line?:ProductLine):Product { return {...p,lineSlug:line?.slug,lineName:line?.name}; }
function activeProducts(c:Catalog,line:ProductLine) { return c.products.filter(p=>p.lineId===line.id&&p.active).sort((a,b)=>a.sortOrder-b.sortOrder||a.name.localeCompare(b.name)).map(p=>mapProduct(p,line)); }

export const verifyAdminCode=createServerFn({method:"POST"}).validator(z.object({code:z.string()})).handler(async({data})=>{
  assertStoreAccess();
  if(data.code!==ADMIN_CODE) throw new Error("That admin code is not valid."); return {ok:true as const};
});
export const listLines=createServerFn({method:"GET"}).handler(async()=> { assertStoreAccess(); return (await readCatalog()).lines.sort((a,b)=>a.sortOrder-b.sortOrder||a.name.localeCompare(b.name)); });
export const getLineBySlug=createServerFn({method:"GET"}).validator(z.object({slug:z.string()})).handler(async({data})=>{
  assertStoreAccess();
  const c=await readCatalog(); const line=c.lines.find(l=>l.slug===data.slug); return line ? {line,products:activeProducts(c,line)} : null;
});
export const getProductBySlug=createServerFn({method:"GET"}).validator(z.object({lineSlug:z.string(),productSlug:z.string()})).handler(async({data})=>{
  assertStoreAccess();
  const c=await readCatalog(); const line=c.lines.find(l=>l.slug===data.lineSlug); if(!line) return null;
  const p=c.products.find(p=>p.lineId===line.id&&p.slug===data.productSlug&&p.active); return p ? mapProduct(p,line) : null;
});

const g3dpgSchema=z.object({
  shape:z.string(),pattern:z.string(),quality:z.string(),periods:z.string(),thickness:z.string(),textureToggle:z.boolean(),textureAmount:z.number(),customName:z.string(),
  size:z.string().optional(),diameter:z.string().optional(),height:z.string().optional(),outerDiameter:z.string().optional(),tubeDiameter:z.string().optional(),wallsToggle:z.boolean().optional(),wallThickness:z.string().optional(),rounded:z.boolean().optional(),cornerRadius:z.string().optional(),color:z.string().optional(),firmness:z.string().optional(),texture:z.string().optional(),quantity:z.number().optional(),orderNumber:z.string().optional(),productName:z.string().optional()
});
const cartItemSchema=z.object({
  productId:z.string(),productName:z.string(),lineName:z.string(),shape:z.string(),color:z.string(),firmness:z.string(),texture:z.string(),quantity:z.number().int().min(1).max(99),unitPriceCents:z.number().int().min(0),personalization:z.string().max(80),g3dpg:g3dpgSchema
});
export const placeOrder=createServerFn({method:"POST"}).validator(z.object({customerName:z.string().min(1).max(80),items:z.array(cartItemSchema).min(1)})).handler(async({data})=>{
  assertStoreAccess();
  const number=await nextOrderNumber(); const total=data.items.reduce((s,i)=>s+i.unitPriceCents*i.quantity,0); const now=new Date().toISOString(); const orderId=newId("ord");
  const items:OrderItem[]=data.items.map(i=>({id:newId("itm"),orderId,productId:i.productId,productName:i.productName,lineName:i.lineName,shape:i.shape,color:i.color,firmness:i.firmness,texture:i.texture,quantity:i.quantity,unitPriceCents:i.unitPriceCents,personalization:i.personalization.trim(),g3dpg:{...i.g3dpg,customName:i.personalization||i.g3dpg.customName,orderNumber:number,productName:i.productName,color:i.color,firmness:i.firmness,texture:i.texture,quantity:i.quantity}}));
  const order:Order={id:orderId,orderNumber:number,customerName:data.customerName.trim(),status:"new",totalCents:total,notes:"",createdAt:now,items};
  await db.insert(g3dStoreOrders).values({
    id: orderId,
    orderNumber: number,
    orderData: order as unknown as Record<string, unknown>,
    createdAt: new Date(now),
  });
  return {orderId,totalCents:total,orderNumber:number};
});
export const getOrderByNumber=createServerFn({method:"GET"}).validator(z.object({orderNumber:z.string()})).handler(async({data})=>{
  assertStoreAccess();
  const [row] = await db.select({ orderData: g3dStoreOrders.orderData })
    .from(g3dStoreOrders)
    .where(eq(g3dStoreOrders.orderNumber, data.orderNumber))
    .limit(1);
  return row ? row.orderData as unknown as Order : null;
});
export const listOrders=createServerFn({method:"POST"}).validator(z.object({adminCode:z.string()})).handler(async({data})=>{
  assertStoreAccess();
  assertAdminAccess(data.adminCode);
  const rows = await db.select({ orderData: g3dStoreOrders.orderData })
    .from(g3dStoreOrders)
    .orderBy(desc(g3dStoreOrders.createdAt));
  return rows.map((row) => row.orderData as unknown as Order);
});
export const updateOrderStatus=createServerFn({method:"POST"}).validator(z.object({adminCode:z.string(),orderId:z.string(),status:z.enum(["new","making","ready","completed","cancelled"])})).handler(async({data})=>{
  assertStoreAccess();
  assertAdminAccess(data.adminCode);
  const [row] = await db.select({ orderData: g3dStoreOrders.orderData })
    .from(g3dStoreOrders)
    .where(eq(g3dStoreOrders.id, data.orderId))
    .limit(1);
  if (!row) throw new Error("Order not found.");
  const order = row.orderData as unknown as Order;
  await db.update(g3dStoreOrders)
    .set({ orderData: { ...order, status: data.status } })
    .where(eq(g3dStoreOrders.id, data.orderId));
  return {ok:true as const};
});

export const listCatalog=createServerFn({method:"POST"}).validator(z.object({adminCode:z.string()})).handler(async({data})=>{
  assertStoreAccess();
  assertAdminAccess(data.adminCode); return await readCatalog();
});
const optionSchema=z.object({id:z.string().min(1),label:z.string().min(1),priceDelta:z.number().int(),hex:z.string().optional(),g3dpgValue:z.string().optional(),imageUrl:z.string().optional(),meta:z.object({thickness:z.number().optional(),periods:z.number().optional(),toggle:z.boolean().optional(),amount:z.number().optional()}).optional()});
const gallerySchema=z.object({url:z.string(),kind:z.enum(["image","gif","video"]),alt:z.string().optional()});
const extraSchema=z.object({quality:z.string().optional(),walls:z.boolean().optional(),wallThickness:z.number().optional(),rounded:z.boolean().optional(),cornerRadius:z.number().optional(),periodsOverride:z.number().optional(),thicknessOverride:z.number().optional()});
export const upsertLine=createServerFn({method:"POST"}).validator(z.object({adminCode:z.string(),id:z.string().optional(),name:z.string().min(1).max(80),slug:z.string().min(1).max(48),tagline:z.string().max(160),description:z.string().max(4000),coverImageUrl:z.string().max(400000),coverGifUrl:z.string().max(400000),sortOrder:z.number().int()})).handler(async({data})=>{
  assertAdminAccess(data.adminCode); const c=await readCatalog(); const id=data.id??newId("line"); const line:ProductLine={id,slug:slugify(data.slug),name:data.name.trim(),tagline:data.tagline.trim(),description:data.description.trim(),coverImageUrl:data.coverImageUrl,coverGifUrl:data.coverGifUrl,sortOrder:data.sortOrder};
  await writeCatalog({...c,lines:[...c.lines.filter(l=>l.id!==id),line]},`Update product line ${line.name}`); return {id,slug:line.slug};
});
export const deleteLine=createServerFn({method:"POST"}).validator(z.object({adminCode:z.string(),id:z.string()})).handler(async({data})=>{
  assertAdminAccess(data.adminCode); const c=await readCatalog(); await writeCatalog({lines:c.lines.filter(l=>l.id!==data.id),products:c.products.filter(p=>p.lineId!==data.id)},`Delete product line ${data.id}`); return {ok:true as const};
});
export const upsertProduct=createServerFn({method:"POST"}).validator(z.object({
  adminCode:z.string(),id:z.string().optional(),lineId:z.string(),name:z.string().min(1).max(80),slug:z.string().min(1).max(48),description:z.string().max(4000),basePriceCents:z.number().int().min(0),
  imageUrl:z.string().max(400000),gifUrl:z.string().max(400000),videoUrl:z.string().max(400000),gallery:z.array(gallerySchema),shapes:z.array(optionSchema),colors:z.array(optionSchema),firmnessOptions:z.array(optionSchema),textureEnabled:z.boolean(),textureOptions:z.array(optionSchema),
  infillPattern:z.string().min(1).max(40),sizeMm:z.number().int().min(8).max(400),extraSettings:extraSchema,active:z.boolean(),sortOrder:z.number().int()
})).handler(async({data})=>{
  assertAdminAccess(data.adminCode); const c=await readCatalog(); const id=data.id??newId("prod"); const product:Product={id,lineId:data.lineId,slug:slugify(data.slug),name:data.name.trim(),description:data.description.trim(),basePriceCents:data.basePriceCents,imageUrl:data.imageUrl,gifUrl:data.gifUrl,videoUrl:data.videoUrl,gallery:data.gallery,shapes:data.shapes,colors:data.colors,firmnessOptions:data.firmnessOptions,textureEnabled:data.textureEnabled,textureOptions:data.textureOptions,infillPattern:data.infillPattern,sizeMm:data.sizeMm,extraSettings:data.extraSettings,active:data.active,sortOrder:data.sortOrder};
  await writeCatalog({...c,products:[...c.products.filter(p=>p.id!==id),product]},`Update product ${product.name}`); return {id,slug:product.slug};
});
export const deleteProduct=createServerFn({method:"POST"}).validator(z.object({adminCode:z.string(),id:z.string()})).handler(async({data})=>{
  assertAdminAccess(data.adminCode); const c=await readCatalog(); await writeCatalog({...c,products:c.products.filter(p=>p.id!==data.id)},`Delete product ${data.id}`); return {ok:true as const};
});
export const createProductFromTemplate=createServerFn({method:"POST"}).validator(z.object({adminCode:z.string(),lineId:z.string(),name:z.string().min(1).max(80)})).handler(async({data})=>{
  assertAdminAccess(data.adminCode); const c=await readCatalog(); const id=newId("prod"); const p:Product={id,lineId:data.lineId,slug:slugify(data.name),name:data.name.trim(),description:"",basePriceCents:2500,imageUrl:"",gifUrl:"",videoUrl:"",gallery:[],shapes:DEFAULT_SHAPES,colors:DEFAULT_COLORS,firmnessOptions:DEFAULT_FIRMNESS,textureEnabled:true,textureOptions:DEFAULT_TEXTURE,infillPattern:"gyroid",sizeMm:50,extraSettings:{quality:"192",rounded:true,cornerRadius:5},active:true,sortOrder:c.products.filter(x=>x.lineId===data.lineId).length};
  await writeCatalog({...c,products:[...c.products,p]},`Create product ${p.name}`); return {id:p.id,slug:p.slug};
});
function slugify(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,48)||"item";}
