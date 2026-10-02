import {
  BASE_SHAPE_PRICE_CENTS,
  DEFAULT_COLORS,
  DEFAULT_FIRMNESS,
  DEFAULT_SHAPES,
  DEFAULT_TEXTURE,
} from "@/lib/catalog-defaults";
import type {
  G3dpgConfig,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductLine,
} from "@/lib/types";
import { newId } from "@/lib/utils";

type Catalog = { lines: ProductLine[]; products: Product[] };

const ADMIN_CODE = "2004051315";
const API_URL =
  import.meta.env.VITE_G3D_API_URL ||
  "https://g3d-orders.vercel.app/api/g3d-orders";

async function apiCall<T>(action: string, data: unknown): Promise<T> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });
  const body = (await response.json()) as {
    ok?: boolean;
    data?: T;
    error?: string;
  };
  if (!response.ok || !body.ok) {
    throw new Error(body.error || `G3D API error ${response.status}`);
  }
  return body.data as T;
}

const CATALOG_KEY = "g3d-orders-pages-catalog-v3";
let catalogPromise: Promise<Catalog> | null = null;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function firmnessPriceDelta(id: string, label: string): number {
  const key = `${id} ${label}`.toLowerCase();
  if (key.includes("hard")) return 50;
  if (key.includes("medium") || key.includes("med ")) return 25;
  return 0;
}

function normalizeCatalogPricing(catalog: Catalog): Catalog {
  return {
    ...catalog,
    products: catalog.products.map((product) => ({
      ...product,
      shapes: product.shapes.map((s) => ({ ...s, priceDelta: 0 })),
      colors: product.colors.map((c) => ({ ...c, priceDelta: 0 })),
      firmnessOptions: product.firmnessOptions.map((f) => ({
        ...f,
        priceDelta: firmnessPriceDelta(f.id, f.label),
      })),
      textureOptions: product.textureOptions.map((t) => ({
        ...t,
        priceDelta: 0,
      })),
    })),
  };
}

function sortLines(lines: ProductLine[]) {
  return [...lines].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  );
}

function sortProducts(products: Product[]) {
  return [...products].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  );
}

function mapProduct(p: Product, line?: ProductLine): Product {
  return { ...p, lineSlug: line?.slug, lineName: line?.name };
}

function activeProducts(catalog: Catalog, line: ProductLine) {
  return sortProducts(
    catalog.products
      .filter((p) => p.lineId === line.id && p.active)
      .map((p) => mapProduct(p, line)),
  );
}

async function loadInitialCatalog(): Promise<Catalog> {
  if (typeof window === "undefined") {
    return { lines: [], products: [] };
  }

  const response = await fetch(`${import.meta.env.BASE_URL}data/catalog.json`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Could not load catalog (${response.status}).`);
  }
  const catalog = normalizeCatalogPricing((await response.json()) as Catalog);
  window.localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
  window.localStorage.removeItem("g3d-orders-pages-catalog-v1");
  window.localStorage.removeItem("g3d-orders-pages-catalog-v2");
  return catalog;
}

async function readCatalog(): Promise<Catalog> {
  catalogPromise ??= loadInitialCatalog();
  return normalizeCatalogPricing(clone(await catalogPromise));
}

async function writeCatalog(catalog: Catalog): Promise<void> {
  if (typeof window === "undefined") return;
  const next = normalizeCatalogPricing(clone(catalog));
  window.localStorage.setItem(CATALOG_KEY, JSON.stringify(next));
  catalogPromise = Promise.resolve(next);
}

function requireAdmin(code: string) {
  if (code !== ADMIN_CODE) throw new Error("That admin code is not valid.");
}

export async function verifyAdminCode({
  data,
}: {
  data: { code: string };
}) {
  requireAdmin(data.code);
  return { ok: true as const };
}

export async function listLines() {
  return sortLines((await readCatalog()).lines);
}

export async function getLineBySlug({
  data,
}: {
  data: { slug: string };
}) {
  const catalog = await readCatalog();
  const line = catalog.lines.find((item) => item.slug === data.slug);
  return line ? { line, products: activeProducts(catalog, line) } : null;
}

export async function getProductBySlug({
  data,
}: {
  data: { lineSlug: string; productSlug: string };
}) {
  const catalog = await readCatalog();
  const line = catalog.lines.find((item) => item.slug === data.lineSlug);
  if (!line) return null;
  const product = catalog.products.find(
    (item) =>
      item.lineId === line.id &&
      item.slug === data.productSlug &&
      item.active,
  );
  return product ? mapProduct(product, line) : null;
}

export async function placeOrder({
  data,
}: {
  data: {
    customerName: string;
    items: Array<{
      productId: string;
      productName: string;
      lineName: string;
      shape: string;
      color: string;
      firmness: string;
      texture: string;
      quantity: number;
      unitPriceCents: number;
      personalization: string;
      g3dpg: G3dpgConfig;
    }>;
  };
}) {
  return apiCall<{
    orderId: string;
    totalCents: number;
    orderNumber: string;
  }>("placeOrder", data);
}

export async function getOrderByNumber({
  data,
}: {
  data: { orderNumber: string };
}) {
  return apiCall<any>("getOrder", data);
}

export async function listOrders({
  data,
}: {
  data: { adminCode: string };
}) {
  return apiCall<any[]>("listOrders", data);
}

export async function updateOrderStatus({
  data,
}: {
  data: { adminCode: string; orderId: string; status: OrderStatus };
}) {
  return apiCall<{ ok: true }>("updateOrderStatus", data);
}

export async function deleteOrder({
  data,
}: {
  data: { adminCode: string; orderId: string };
}) {
  return apiCall<{ ok: true }>("deleteOrder", data);
}

export async function listCatalog({
  data,
}: {
  data: { adminCode: string };
}) {
  requireAdmin(data.adminCode);
  return readCatalog();
}

export async function upsertLine({
  data,
}: {
  data: {
    adminCode: string;
    id?: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    coverImageUrl: string;
    coverGifUrl: string;
    sortOrder: number;
  };
}) {
  requireAdmin(data.adminCode);
  const catalog = await readCatalog();
  const id = data.id ?? newId("line");
  const line: ProductLine = {
    id,
    slug: data.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48) || "line",
    name: data.name.trim(),
    tagline: data.tagline.trim(),
    description: data.description.trim(),
    coverImageUrl: data.coverImageUrl,
    coverGifUrl: data.coverGifUrl,
    sortOrder: data.sortOrder,
  };
  await writeCatalog({
    lines: [...catalog.lines.filter((item) => item.id !== id), line],
    products: catalog.products,
  });
  return { id, slug: line.slug };
}

export async function deleteLine({
  data,
}: {
  data: { adminCode: string; id: string };
}) {
  requireAdmin(data.adminCode);
  const catalog = await readCatalog();
  await writeCatalog({
    lines: catalog.lines.filter((line) => line.id !== data.id),
    products: catalog.products.filter((product) => product.lineId !== data.id),
  });
  return { ok: true as const };
}

export async function upsertProduct({
  data,
}: {
  data: {
    adminCode: string;
    id?: string;
    lineId: string;
    name: string;
    slug: string;
    description: string;
    basePriceCents: number;
    imageUrl: string;
    gifUrl: string;
    videoUrl: string;
    gallery: Product["gallery"];
    shapes: Product["shapes"];
    colors: Product["colors"];
    firmnessOptions: Product["firmnessOptions"];
    textureEnabled: boolean;
    textureOptions: Product["textureOptions"];
    infillPattern: string;
    sizeMm: number;
    extraSettings: Product["extraSettings"];
    active: boolean;
    sortOrder: number;
  };
}) {
  requireAdmin(data.adminCode);
  const catalog = await readCatalog();
  const id = data.id ?? newId("prod");
  const product: Product = {
    id,
    lineId: data.lineId,
    slug:
      data.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 48) || "product",
    name: data.name.trim(),
    description: data.description.trim(),
    basePriceCents: data.basePriceCents,
    imageUrl: data.imageUrl,
    gifUrl: data.gifUrl,
    videoUrl: data.videoUrl,
    gallery: data.gallery,
    shapes: data.shapes.map((s) => ({ ...s, priceDelta: 0 })),
    colors: data.colors.map((c) => ({ ...c, priceDelta: 0 })),
    firmnessOptions: data.firmnessOptions.map((f) => ({
      ...f,
      priceDelta: firmnessPriceDelta(f.id, f.label),
    })),
    textureEnabled: data.textureEnabled,
    textureOptions: data.textureOptions.map((t) => ({ ...t, priceDelta: 0 })),
    infillPattern: data.infillPattern,
    sizeMm: data.sizeMm,
    extraSettings: data.extraSettings,
    active: data.active,
    sortOrder: data.sortOrder,
  };
  await writeCatalog({
    lines: catalog.lines,
    products: [
      ...catalog.products.filter((item) => item.id !== id),
      product,
    ],
  });
  return { id, slug: product.slug };
}

export async function deleteProduct({
  data,
}: {
  data: { adminCode: string; id: string };
}) {
  requireAdmin(data.adminCode);
  const catalog = await readCatalog();
  await writeCatalog({
    lines: catalog.lines,
    products: catalog.products.filter((product) => product.id !== data.id),
  });
  return { ok: true as const };
}

export async function createProductFromTemplate({
  data,
}: {
  data: { adminCode: string; lineId: string; name: string };
}) {
  requireAdmin(data.adminCode);
  const catalog = await readCatalog();
  const id = newId("prod");
  const product: Product = {
    id,
    lineId: data.lineId,
    slug:
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 48) || "product",
    name: data.name.trim(),
    description: "",
    basePriceCents: BASE_SHAPE_PRICE_CENTS,
    imageUrl: "",
    gifUrl: "",
    videoUrl: "",
    gallery: [],
    shapes: clone(DEFAULT_SHAPES),
    colors: clone(DEFAULT_COLORS),
    firmnessOptions: clone(DEFAULT_FIRMNESS),
    textureEnabled: true,
    textureOptions: clone(DEFAULT_TEXTURE),
    infillPattern: "gyroid",
    sizeMm: 50,
    extraSettings: { quality: "192", rounded: true, cornerRadius: 5 },
    active: true,
    sortOrder: catalog.products.filter((item) => item.lineId === data.lineId).length,
  };
  await writeCatalog({
    lines: catalog.lines,
    products: [...catalog.products, product],
  });
  return { id: product.id, slug: product.slug };
}
