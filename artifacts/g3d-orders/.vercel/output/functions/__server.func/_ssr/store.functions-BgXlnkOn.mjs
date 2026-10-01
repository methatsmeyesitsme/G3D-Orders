import { r as newId } from "./utils-Doa1GMob.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as numberType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store.functions-BgXlnkOn.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var DEFAULT_SHAPES = [
	{
		id: "gumdrop",
		label: "Gumdrop",
		priceDelta: 0,
		g3dpgValue: "gumdrop"
	},
	{
		id: "cube",
		label: "Square / Cube",
		priceDelta: 0,
		g3dpgValue: "cube"
	},
	{
		id: "sphere",
		label: "Ball / Sphere",
		priceDelta: 0,
		g3dpgValue: "sphere"
	},
	{
		id: "cylinder",
		label: "Cylinder",
		priceDelta: 200,
		g3dpgValue: "cylinder"
	},
	{
		id: "ring",
		label: "Ring / Torus",
		priceDelta: 400,
		g3dpgValue: "ring"
	}
];
var DEFAULT_COLORS = [
	{
		id: "black",
		label: "Black",
		hex: "#171717",
		priceDelta: 0
	},
	{
		id: "red",
		label: "Red",
		hex: "#c2302a",
		priceDelta: 0
	},
	{
		id: "white",
		label: "White",
		hex: "#f4f1ea",
		priceDelta: 0
	},
	{
		id: "blue",
		label: "Blue",
		hex: "#1e4f8f",
		priceDelta: 0
	},
	{
		id: "yellow",
		label: "Yellow",
		hex: "#d9a800",
		priceDelta: 0
	},
	{
		id: "orange",
		label: "Orange",
		hex: "#e06a2c",
		priceDelta: 0
	}
];
var DEFAULT_FIRMNESS = [
	{
		id: "super-soft",
		label: "Super Soft",
		priceDelta: 0,
		meta: {
			thickness: .8,
			periods: 2
		}
	},
	{
		id: "soft",
		label: "Soft",
		priceDelta: 0,
		meta: {
			thickness: 1.2,
			periods: 2.2
		}
	},
	{
		id: "medium",
		label: "Medium",
		priceDelta: 200,
		meta: {
			thickness: 1.5,
			periods: 2.5
		}
	},
	{
		id: "firm",
		label: "Firm",
		priceDelta: 300,
		meta: {
			thickness: 2.1,
			periods: 2.8
		}
	},
	{
		id: "super-firm",
		label: "Super Firm",
		priceDelta: 500,
		meta: {
			thickness: 2.8,
			periods: 3.2
		}
	}
];
var DEFAULT_TEXTURE = [
	{
		id: "none",
		label: "Smooth",
		priceDelta: 0,
		meta: {
			toggle: false,
			amount: 0
		}
	},
	{
		id: "light",
		label: "Light grain",
		priceDelta: 100,
		meta: {
			toggle: true,
			amount: 25
		}
	},
	{
		id: "moderate",
		label: "Moderate",
		priceDelta: 200,
		meta: {
			toggle: true,
			amount: 50
		}
	},
	{
		id: "heavy",
		label: "Heavy grain",
		priceDelta: 400,
		meta: {
			toggle: true,
			amount: 85
		}
	}
];
var ADMIN_CODE = process.env.G3D_ADMIN_PASSCODE?.trim() || "2004051315";
var GH_TOKEN = process.env.G3D_GITHUB_TOKEN?.trim();
var GH_OWNER = process.env.G3D_GITHUB_OWNER?.trim() || "methatsmeyesitsme";
var GH_REPO = process.env.G3D_GITHUB_REPO?.trim() || "G3D-Orders";
var GH_BRANCH = process.env.G3D_GITHUB_BRANCH?.trim() || "main";
var CATALOG_PATH = "data/catalog.json";
var ORDERS_PATH = "data/orders";
function assertAdminAccess(code) {
	if (code !== ADMIN_CODE) throw new Error("Admin access denied");
}
function requireGithubWrite() {
	if (!GH_TOKEN) throw new Error("G3D GitHub storage is not configured on this deployment.");
}
function ghHeaders() {
	const h = {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		"User-Agent": "G3D-Orders"
	};
	if (GH_TOKEN) h.Authorization = `Bearer ${GH_TOKEN}`;
	return h;
}
async function ghJson(path, init) {
	const res = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}${path}`, {
		...init,
		headers: {
			...ghHeaders(),
			...init?.headers || {}
		}
	});
	if (!res.ok) throw new Error(`GitHub storage error ${res.status}: ${await res.text()}`);
	return await res.json();
}
function decodeGithubContent(content) {
	return Buffer.from(content.replace(/\s/g, ""), "base64").toString("utf8");
}
function encodeGithubContent(value) {
	return Buffer.from(value, "utf8").toString("base64");
}
async function getGithubFile(path) {
	return ghJson(`/contents/${path}?ref=${encodeURIComponent(GH_BRANCH)}`);
}
async function readCatalog() {
	try {
		return JSON.parse(decodeGithubContent((await getGithubFile(CATALOG_PATH)).content));
	} catch {
		return {
			lines: [],
			products: []
		};
	}
}
async function writeGithubFile(path, content, message, sha) {
	requireGithubWrite();
	const body = {
		message,
		content: encodeGithubContent(content),
		branch: GH_BRANCH
	};
	if (sha) body.sha = sha;
	await ghJson(`/contents/${path}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
}
async function writeCatalog(catalog, message) {
	let sha;
	try {
		sha = (await getGithubFile(CATALOG_PATH)).sha;
	} catch {}
	await writeGithubFile(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n", message, sha);
}
async function readOrderFile(path) {
	return JSON.parse(decodeGithubContent((await getGithubFile(path)).content));
}
async function listOrderPaths() {
	try {
		return (await ghJson(`/contents/${ORDERS_PATH}?ref=${encodeURIComponent(GH_BRANCH)}`)).filter((r) => r.type === "file" && r.name.endsWith(".json")).map((r) => r.path);
	} catch {
		return [];
	}
}
async function nextOrderNumber() {
	const paths = await listOrderPaths();
	const used = /* @__PURE__ */ new Set();
	for (const path of paths) try {
		used.add((await readOrderFile(path)).orderNumber);
	} catch {}
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	for (let attempt = 0; attempt < 50; attempt++) {
		let suffix = "";
		for (let i = 0; i < 6; i++) suffix += alphabet[Math.floor(Math.random() * 32)];
		const number = `G3D-${suffix}`;
		if (!used.has(number)) return number;
	}
	return `G3D-${Date.now().toString(36).toUpperCase()}`;
}
function mapProduct(p, line) {
	return {
		...p,
		lineSlug: line?.slug,
		lineName: line?.name
	};
}
function activeProducts(c, line) {
	return c.products.filter((p) => p.lineId === line.id && p.active).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)).map((p) => mapProduct(p, line));
}
var verifyAdminCode_createServerFn_handler = createServerRpc({
	id: "8b9db708be573863088f03ff45d5b88c981412c12401cf334d9fb1c2298088cd",
	name: "verifyAdminCode",
	filename: "src/lib/store.functions.ts"
}, (opts) => verifyAdminCode.__executeServer(opts));
var verifyAdminCode = createServerFn({ method: "POST" }).validator(objectType({ code: stringType() })).handler(verifyAdminCode_createServerFn_handler, async ({ data }) => {
	if (data.code !== ADMIN_CODE) throw new Error("That admin code is not valid.");
	return { ok: true };
});
var listLines_createServerFn_handler = createServerRpc({
	id: "74476a4ccb59e9866473845740bc7176a0c5cb5e8ef70634d2ac492afe62229f",
	name: "listLines",
	filename: "src/lib/store.functions.ts"
}, (opts) => listLines.__executeServer(opts));
var listLines = createServerFn({ method: "GET" }).handler(listLines_createServerFn_handler, async () => (await readCatalog()).lines.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)));
var getLineBySlug_createServerFn_handler = createServerRpc({
	id: "0415884af848bd3da7e3fbe5dee23e09230c5ea32497d59bf555dcfb6458ebd9",
	name: "getLineBySlug",
	filename: "src/lib/store.functions.ts"
}, (opts) => getLineBySlug.__executeServer(opts));
var getLineBySlug = createServerFn({ method: "GET" }).validator(objectType({ slug: stringType() })).handler(getLineBySlug_createServerFn_handler, async ({ data }) => {
	const c = await readCatalog();
	const line = c.lines.find((l) => l.slug === data.slug);
	return line ? {
		line,
		products: activeProducts(c, line)
	} : null;
});
var getProductBySlug_createServerFn_handler = createServerRpc({
	id: "6d01fe2bca3c1a6af7afcd2612bbeff16bd5dd41b13a9a41739f3936ece00113",
	name: "getProductBySlug",
	filename: "src/lib/store.functions.ts"
}, (opts) => getProductBySlug.__executeServer(opts));
var getProductBySlug = createServerFn({ method: "GET" }).validator(objectType({
	lineSlug: stringType(),
	productSlug: stringType()
})).handler(getProductBySlug_createServerFn_handler, async ({ data }) => {
	const c = await readCatalog();
	const line = c.lines.find((l) => l.slug === data.lineSlug);
	if (!line) return null;
	const p = c.products.find((p) => p.lineId === line.id && p.slug === data.productSlug && p.active);
	return p ? mapProduct(p, line) : null;
});
var g3dpgSchema = objectType({
	shape: stringType(),
	pattern: stringType(),
	quality: stringType(),
	periods: stringType(),
	thickness: stringType(),
	textureToggle: booleanType(),
	textureAmount: numberType(),
	customName: stringType(),
	size: stringType().optional(),
	diameter: stringType().optional(),
	height: stringType().optional(),
	outerDiameter: stringType().optional(),
	tubeDiameter: stringType().optional(),
	wallsToggle: booleanType().optional(),
	wallThickness: stringType().optional(),
	rounded: booleanType().optional(),
	cornerRadius: stringType().optional(),
	color: stringType().optional(),
	firmness: stringType().optional(),
	texture: stringType().optional(),
	quantity: numberType().optional(),
	orderNumber: stringType().optional(),
	productName: stringType().optional()
});
var cartItemSchema = objectType({
	productId: stringType(),
	productName: stringType(),
	lineName: stringType(),
	shape: stringType(),
	color: stringType(),
	firmness: stringType(),
	texture: stringType(),
	quantity: numberType().int().min(1).max(99),
	unitPriceCents: numberType().int().min(0),
	personalization: stringType().max(80),
	g3dpg: g3dpgSchema
});
var placeOrder_createServerFn_handler = createServerRpc({
	id: "90954bf6eb46204d3fcbe413f4732bb8c7d7db678553e104ffa92a324b365bba",
	name: "placeOrder",
	filename: "src/lib/store.functions.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator(objectType({
	customerName: stringType().min(1).max(80),
	items: arrayType(cartItemSchema).min(1)
})).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	const number = await nextOrderNumber();
	const total = data.items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const orderId = newId("ord");
	const items = data.items.map((i) => ({
		id: newId("itm"),
		orderId,
		productId: i.productId,
		productName: i.productName,
		lineName: i.lineName,
		shape: i.shape,
		color: i.color,
		firmness: i.firmness,
		texture: i.texture,
		quantity: i.quantity,
		unitPriceCents: i.unitPriceCents,
		personalization: i.personalization.trim(),
		g3dpg: {
			...i.g3dpg,
			customName: i.personalization || i.g3dpg.customName,
			orderNumber: number,
			productName: i.productName,
			color: i.color,
			firmness: i.firmness,
			texture: i.texture,
			quantity: i.quantity
		}
	}));
	const order = {
		id: orderId,
		orderNumber: number,
		customerName: data.customerName.trim(),
		status: "new",
		totalCents: total,
		notes: "",
		createdAt: now,
		items
	};
	await writeGithubFile(`${ORDERS_PATH}/${orderId}.json`, JSON.stringify(order, null, 2) + "\n", `Add G3D order ${number}`);
	return {
		orderId,
		totalCents: total,
		orderNumber: number
	};
});
var getOrderByNumber_createServerFn_handler = createServerRpc({
	id: "e0173ddb81d5be896c6961860650039db1c0e5e0b8b5c52053f6db11dbc980bf",
	name: "getOrderByNumber",
	filename: "src/lib/store.functions.ts"
}, (opts) => getOrderByNumber.__executeServer(opts));
var getOrderByNumber = createServerFn({ method: "GET" }).validator(objectType({ orderNumber: stringType() })).handler(getOrderByNumber_createServerFn_handler, async ({ data }) => {
	for (const path of await listOrderPaths()) try {
		const order = await readOrderFile(path);
		if (order.orderNumber === data.orderNumber) return order;
	} catch {}
	return null;
});
var listOrders_createServerFn_handler = createServerRpc({
	id: "136944701bc969aa8ada70fb7ca5938c4c1975bb114752711a9c68048237076a",
	name: "listOrders",
	filename: "src/lib/store.functions.ts"
}, (opts) => listOrders.__executeServer(opts));
var listOrders = createServerFn({ method: "POST" }).validator(objectType({ adminCode: stringType() })).handler(listOrders_createServerFn_handler, async ({ data }) => {
	assertAdminAccess(data.adminCode);
	const orders = [];
	for (const path of await listOrderPaths()) try {
		orders.push(await readOrderFile(path));
	} catch {}
	return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});
var updateOrderStatus_createServerFn_handler = createServerRpc({
	id: "72c96484af0296e5e44d41d7449cebf87722fa1c70237c24475e222f19f8deaf",
	name: "updateOrderStatus",
	filename: "src/lib/store.functions.ts"
}, (opts) => updateOrderStatus.__executeServer(opts));
var updateOrderStatus = createServerFn({ method: "POST" }).validator(objectType({
	adminCode: stringType(),
	orderId: stringType(),
	status: enumType([
		"new",
		"making",
		"ready",
		"completed",
		"cancelled"
	])
})).handler(updateOrderStatus_createServerFn_handler, async ({ data }) => {
	assertAdminAccess(data.adminCode);
	const path = `${ORDERS_PATH}/${data.orderId}.json`;
	const file = await getGithubFile(path);
	const order = JSON.parse(decodeGithubContent(file.content));
	await writeGithubFile(path, JSON.stringify({
		...order,
		status: data.status
	}, null, 2) + "\n", `Update order ${order.orderNumber} status to ${data.status}`, file.sha);
	return { ok: true };
});
var listCatalog_createServerFn_handler = createServerRpc({
	id: "ff64f0e539c6dab903b2b80e19f28ffc6b2cc3685e3220f5c705a3152f375c1c",
	name: "listCatalog",
	filename: "src/lib/store.functions.ts"
}, (opts) => listCatalog.__executeServer(opts));
var listCatalog = createServerFn({ method: "POST" }).validator(objectType({ adminCode: stringType() })).handler(listCatalog_createServerFn_handler, async ({ data }) => {
	assertAdminAccess(data.adminCode);
	return await readCatalog();
});
var optionSchema = objectType({
	id: stringType().min(1),
	label: stringType().min(1),
	priceDelta: numberType().int(),
	hex: stringType().optional(),
	g3dpgValue: stringType().optional(),
	imageUrl: stringType().optional(),
	meta: objectType({
		thickness: numberType().optional(),
		periods: numberType().optional(),
		toggle: booleanType().optional(),
		amount: numberType().optional()
	}).optional()
});
var gallerySchema = objectType({
	url: stringType(),
	kind: enumType([
		"image",
		"gif",
		"video"
	]),
	alt: stringType().optional()
});
var extraSchema = objectType({
	quality: stringType().optional(),
	walls: booleanType().optional(),
	wallThickness: numberType().optional(),
	rounded: booleanType().optional(),
	cornerRadius: numberType().optional(),
	periodsOverride: numberType().optional(),
	thicknessOverride: numberType().optional()
});
var upsertLine_createServerFn_handler = createServerRpc({
	id: "e54e178a45bc56d0642e3a07fcf18474ac75a57b706dfa7d7d5ca21b17cc8a32",
	name: "upsertLine",
	filename: "src/lib/store.functions.ts"
}, (opts) => upsertLine.__executeServer(opts));
var upsertLine = createServerFn({ method: "POST" }).validator(objectType({
	adminCode: stringType(),
	id: stringType().optional(),
	name: stringType().min(1).max(80),
	slug: stringType().min(1).max(48),
	tagline: stringType().max(160),
	description: stringType().max(4e3),
	coverImageUrl: stringType().max(4e5),
	coverGifUrl: stringType().max(4e5),
	sortOrder: numberType().int()
})).handler(upsertLine_createServerFn_handler, async ({ data }) => {
	assertAdminAccess(data.adminCode);
	const c = await readCatalog();
	const id = data.id ?? newId("line");
	const line = {
		id,
		slug: slugify(data.slug),
		name: data.name.trim(),
		tagline: data.tagline.trim(),
		description: data.description.trim(),
		coverImageUrl: data.coverImageUrl,
		coverGifUrl: data.coverGifUrl,
		sortOrder: data.sortOrder
	};
	await writeCatalog({
		...c,
		lines: [...c.lines.filter((l) => l.id !== id), line]
	}, `Update product line ${line.name}`);
	return {
		id,
		slug: line.slug
	};
});
var deleteLine_createServerFn_handler = createServerRpc({
	id: "30e9a5bb272f8376555743636b8f80f5cf65616cb595ce50f52e9135fbdac70d",
	name: "deleteLine",
	filename: "src/lib/store.functions.ts"
}, (opts) => deleteLine.__executeServer(opts));
var deleteLine = createServerFn({ method: "POST" }).validator(objectType({
	adminCode: stringType(),
	id: stringType()
})).handler(deleteLine_createServerFn_handler, async ({ data }) => {
	assertAdminAccess(data.adminCode);
	const c = await readCatalog();
	await writeCatalog({
		lines: c.lines.filter((l) => l.id !== data.id),
		products: c.products.filter((p) => p.lineId !== data.id)
	}, `Delete product line ${data.id}`);
	return { ok: true };
});
var upsertProduct_createServerFn_handler = createServerRpc({
	id: "cacb72a1a3f0b961deb7ef8344fce55b23b11d48d79887d1d85340efcd1d0647",
	name: "upsertProduct",
	filename: "src/lib/store.functions.ts"
}, (opts) => upsertProduct.__executeServer(opts));
var upsertProduct = createServerFn({ method: "POST" }).validator(objectType({
	adminCode: stringType(),
	id: stringType().optional(),
	lineId: stringType(),
	name: stringType().min(1).max(80),
	slug: stringType().min(1).max(48),
	description: stringType().max(4e3),
	basePriceCents: numberType().int().min(0),
	imageUrl: stringType().max(4e5),
	gifUrl: stringType().max(4e5),
	videoUrl: stringType().max(4e5),
	gallery: arrayType(gallerySchema),
	shapes: arrayType(optionSchema),
	colors: arrayType(optionSchema),
	firmnessOptions: arrayType(optionSchema),
	textureEnabled: booleanType(),
	textureOptions: arrayType(optionSchema),
	infillPattern: stringType().min(1).max(40),
	sizeMm: numberType().int().min(8).max(400),
	extraSettings: extraSchema,
	active: booleanType(),
	sortOrder: numberType().int()
})).handler(upsertProduct_createServerFn_handler, async ({ data }) => {
	assertAdminAccess(data.adminCode);
	const c = await readCatalog();
	const id = data.id ?? newId("prod");
	const product = {
		id,
		lineId: data.lineId,
		slug: slugify(data.slug),
		name: data.name.trim(),
		description: data.description.trim(),
		basePriceCents: data.basePriceCents,
		imageUrl: data.imageUrl,
		gifUrl: data.gifUrl,
		videoUrl: data.videoUrl,
		gallery: data.gallery,
		shapes: data.shapes,
		colors: data.colors,
		firmnessOptions: data.firmnessOptions,
		textureEnabled: data.textureEnabled,
		textureOptions: data.textureOptions,
		infillPattern: data.infillPattern,
		sizeMm: data.sizeMm,
		extraSettings: data.extraSettings,
		active: data.active,
		sortOrder: data.sortOrder
	};
	await writeCatalog({
		...c,
		products: [...c.products.filter((p) => p.id !== id), product]
	}, `Update product ${product.name}`);
	return {
		id,
		slug: product.slug
	};
});
var deleteProduct_createServerFn_handler = createServerRpc({
	id: "cd02911c6606b71ebf66b532d825c6fd9886e0069512f83b6c44e180c98f0106",
	name: "deleteProduct",
	filename: "src/lib/store.functions.ts"
}, (opts) => deleteProduct.__executeServer(opts));
var deleteProduct = createServerFn({ method: "POST" }).validator(objectType({
	adminCode: stringType(),
	id: stringType()
})).handler(deleteProduct_createServerFn_handler, async ({ data }) => {
	assertAdminAccess(data.adminCode);
	const c = await readCatalog();
	await writeCatalog({
		...c,
		products: c.products.filter((p) => p.id !== data.id)
	}, `Delete product ${data.id}`);
	return { ok: true };
});
var createProductFromTemplate_createServerFn_handler = createServerRpc({
	id: "eb38f07e3c167710aaf657feadf5d6a084fd1f3213d59e5287d7c8d1169f25db",
	name: "createProductFromTemplate",
	filename: "src/lib/store.functions.ts"
}, (opts) => createProductFromTemplate.__executeServer(opts));
var createProductFromTemplate = createServerFn({ method: "POST" }).validator(objectType({
	adminCode: stringType(),
	lineId: stringType(),
	name: stringType().min(1).max(80)
})).handler(createProductFromTemplate_createServerFn_handler, async ({ data }) => {
	assertAdminAccess(data.adminCode);
	const c = await readCatalog();
	const p = {
		id: newId("prod"),
		lineId: data.lineId,
		slug: slugify(data.name),
		name: data.name.trim(),
		description: "",
		basePriceCents: 2500,
		imageUrl: "",
		gifUrl: "",
		videoUrl: "",
		gallery: [],
		shapes: DEFAULT_SHAPES,
		colors: DEFAULT_COLORS,
		firmnessOptions: DEFAULT_FIRMNESS,
		textureEnabled: true,
		textureOptions: DEFAULT_TEXTURE,
		infillPattern: "gyroid",
		sizeMm: 50,
		extraSettings: {
			quality: "192",
			rounded: true,
			cornerRadius: 5
		},
		active: true,
		sortOrder: c.products.filter((x) => x.lineId === data.lineId).length
	};
	await writeCatalog({
		...c,
		products: [...c.products, p]
	}, `Create product ${p.name}`);
	return {
		id: p.id,
		slug: p.slug
	};
});
function slugify(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48) || "item";
}
//#endregion
export { createProductFromTemplate_createServerFn_handler, deleteLine_createServerFn_handler, deleteProduct_createServerFn_handler, getLineBySlug_createServerFn_handler, getOrderByNumber_createServerFn_handler, getProductBySlug_createServerFn_handler, listCatalog_createServerFn_handler, listLines_createServerFn_handler, listOrders_createServerFn_handler, placeOrder_createServerFn_handler, updateOrderStatus_createServerFn_handler, upsertLine_createServerFn_handler, upsertProduct_createServerFn_handler, verifyAdminCode_createServerFn_handler };
