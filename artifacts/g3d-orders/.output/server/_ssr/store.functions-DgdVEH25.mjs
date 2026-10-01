import { a as setCookie, i as getRequest, n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as numberType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as timestamp, c as esm_default, i as pgTable, n as desc, o as text, r as eq, s as jsonb, t as drizzle } from "../_libs/drizzle-orm.mjs";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-Doa1GMob.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatMoney(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
}
function newId(prefix) {
	return `${prefix}_${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "").slice(0, 12) : Math.random().toString(36).slice(2, 14)}`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/store.functions-DgdVEH25.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var g3dCatalogState = pgTable("g3d_catalog_state", {
	id: text("id").primaryKey(),
	catalog: jsonb("catalog").$type().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var g3dStoreOrders = pgTable("g3d_store_orders", {
	id: text("id").primaryKey(),
	orderNumber: text("order_number").notNull().unique(),
	orderData: jsonb("order_data").$type().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
var schema_exports = /* @__PURE__ */ __exportAll({
	g3dCatalogState: () => g3dCatalogState,
	g3dStoreOrders: () => g3dStoreOrders
});
var { Pool } = esm_default;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });
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
var ACCESS_COOKIE = "g3d_store_access";
var ACCESS_MAX_AGE_SECONDS = 1209600;
function equalSecret(left, right) {
	const leftBytes = Buffer.from(left);
	const rightBytes = Buffer.from(right);
	return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}
function signature(expiresAt, code, secret) {
	return createHmac("sha256", secret).update(`g3d-store-access:${code}:${expiresAt}`).digest("base64url");
}
function verifyStoreCode(candidate) {
	const code = process.env.G3D_STORE_PASSCODE?.trim();
	const secret = process.env.SESSION_SECRET?.trim();
	if (!code || !secret) return "not-configured";
	return equalSecret(candidate, code) ? "valid" : "invalid";
}
function setStoreAccessCookie() {
	const code = process.env.G3D_STORE_PASSCODE?.trim();
	const secret = process.env.SESSION_SECRET?.trim();
	if (!code || !secret) throw new Error("Store access is not configured.");
	const expiresAt = Math.floor(Date.now() / 1e3) + ACCESS_MAX_AGE_SECONDS;
	setCookie(ACCESS_COOKIE, `${expiresAt}.${signature(expiresAt, code, secret)}`, {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge: ACCESS_MAX_AGE_SECONDS
	});
}
function hasStoreAccess() {
	const code = process.env.G3D_STORE_PASSCODE?.trim();
	const secret = process.env.SESSION_SECRET?.trim();
	if (!code || !secret) return false;
	const cookie = (getRequest()?.headers.get("cookie") ?? "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ACCESS_COOKIE}=`))?.slice(17);
	if (!cookie) return false;
	const separator = cookie.indexOf(".");
	if (separator < 1) return false;
	const expiresAtText = cookie.slice(0, separator);
	const suppliedSignature = cookie.slice(separator + 1);
	if (!/^\d+$/.test(expiresAtText) || !suppliedSignature) return false;
	const expiresAt = Number(expiresAtText);
	if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now() / 1e3) return false;
	return equalSecret(suppliedSignature, signature(expiresAt, code, secret));
}
function assertStoreAccess() {
	if (!hasStoreAccess()) throw new Error("Enter the store access code to continue.");
}
var catalog_default = {
	lines: [{
		"id": "line_g3d_squish",
		"slug": "g3d-squish",
		"name": "G3D Squish",
		"tagline": "Lattice you can press.",
		"description": "Printed gyroid structures with a closed outer skin. Choose the form, filament color, how far it yields, and how much grain sits on the surface. Every Squish is generated in G3DPG from the exact options on the order.",
		"coverImageUrl": "/products/line-squish.jpg",
		"coverGifUrl": "/products/squish-flex.gif",
		"sortOrder": 0
	}],
	products: [
		{
			"id": "prod_classic_squish",
			"lineId": "line_g3d_squish",
			"slug": "classic",
			"name": "Classic Squish",
			"description": "The original G3D Squish. A palm-sized gyroid body with rounded volume, printed as a single lattice so it flexes evenly in the hand. Customize the silhouette, filament, yield, and surface grain. Name is embossed into the G3DPG file so the print job matches the order.",
			"basePriceCents": 2800,
			"imageUrl": "/products/gumdrop.jpg",
			"gifUrl": "/products/squish-flex.gif",
			"videoUrl": "/products/squish-flex.mp4",
			"gallery": [
				{
					"url": "/products/gumdrop.jpg",
					"kind": "image",
					"alt": "Classic Squish gumdrop"
				},
				{
					"url": "/products/squish-flex.gif",
					"kind": "gif",
					"alt": "Squish flex"
				},
				{
					"url": "/products/squish-flex.mp4",
					"kind": "video",
					"alt": "Squish in hand"
				},
				{
					"url": "/products/cube.jpg",
					"kind": "image",
					"alt": "Cube form"
				},
				{
					"url": "/products/sphere.jpg",
					"kind": "image",
					"alt": "Sphere form"
				},
				{
					"url": "/products/macro.jpg",
					"kind": "image",
					"alt": "Gyroid close-up"
				}
			],
			"shapes": [
				{
					"id": "gumdrop",
					"label": "Gumdrop",
					"priceDelta": 0,
					"g3dpgValue": "gumdrop"
				},
				{
					"id": "cube",
					"label": "Square / Cube",
					"priceDelta": 0,
					"g3dpgValue": "cube"
				},
				{
					"id": "sphere",
					"label": "Ball / Sphere",
					"priceDelta": 0,
					"g3dpgValue": "sphere"
				},
				{
					"id": "cylinder",
					"label": "Cylinder",
					"priceDelta": 200,
					"g3dpgValue": "cylinder"
				},
				{
					"id": "ring",
					"label": "Ring / Torus",
					"priceDelta": 400,
					"g3dpgValue": "ring"
				}
			],
			"colors": [
				{
					"id": "black",
					"label": "Black",
					"hex": "#171717",
					"priceDelta": 0,
					"imageUrl": "/products/sphere-black.jpg"
				},
				{
					"id": "red",
					"label": "Red",
					"hex": "#c2302a",
					"priceDelta": 0,
					"imageUrl": "/products/cube-red.jpg"
				},
				{
					"id": "white",
					"label": "White",
					"hex": "#f4f1ea",
					"priceDelta": 0,
					"imageUrl": "/products/gumdrop.jpg"
				},
				{
					"id": "blue",
					"label": "Blue",
					"hex": "#1e4f8f",
					"priceDelta": 0,
					"imageUrl": "/products/gumdrop-blue.jpg"
				},
				{
					"id": "yellow",
					"label": "Yellow",
					"hex": "#d9a800",
					"priceDelta": 0
				},
				{
					"id": "orange",
					"label": "Orange",
					"hex": "#e06a2c",
					"priceDelta": 0
				}
			],
			"firmnessOptions": [
				{
					"id": "super-soft",
					"label": "Super Soft",
					"priceDelta": 0,
					"meta": {
						"thickness": .8,
						"periods": 2
					}
				},
				{
					"id": "soft",
					"label": "Soft",
					"priceDelta": 0,
					"meta": {
						"thickness": 1.2,
						"periods": 2.2
					}
				},
				{
					"id": "medium",
					"label": "Medium",
					"priceDelta": 200,
					"meta": {
						"thickness": 1.5,
						"periods": 2.5
					}
				},
				{
					"id": "firm",
					"label": "Firm",
					"priceDelta": 300,
					"meta": {
						"thickness": 2.1,
						"periods": 2.8
					}
				},
				{
					"id": "super-firm",
					"label": "Super Firm",
					"priceDelta": 500,
					"meta": {
						"thickness": 2.8,
						"periods": 3.2
					}
				}
			],
			"textureEnabled": true,
			"textureOptions": [
				{
					"id": "none",
					"label": "Smooth",
					"priceDelta": 0,
					"meta": {
						"toggle": false,
						"amount": 0
					}
				},
				{
					"id": "light",
					"label": "Light grain",
					"priceDelta": 100,
					"meta": {
						"toggle": true,
						"amount": 25
					}
				},
				{
					"id": "moderate",
					"label": "Moderate",
					"priceDelta": 200,
					"meta": {
						"toggle": true,
						"amount": 50
					}
				},
				{
					"id": "heavy",
					"label": "Heavy grain",
					"priceDelta": 400,
					"meta": {
						"toggle": true,
						"amount": 85
					}
				}
			],
			"infillPattern": "gyroid",
			"sizeMm": 50,
			"extraSettings": {
				"quality": "192",
				"rounded": true,
				"cornerRadius": 5
			},
			"active": true,
			"sortOrder": 0
		},
		{
			"id": "prod_pocket_squish",
			"lineId": "line_g3d_squish",
			"slug": "pocket",
			"name": "Pocket Squish",
			"description": "A smaller gyroid body for a pocket or bag. Same color, firmness, and grain controls as Classic, scaled to 35mm. Prints faster, still a full G3DPG job.",
			"basePriceCents": 1800,
			"imageUrl": "/products/sphere.jpg",
			"gifUrl": "/products/squish-flex.gif",
			"videoUrl": "/products/squish-flex.mp4",
			"gallery": [
				{
					"url": "/products/sphere.jpg",
					"kind": "image",
					"alt": "Pocket Squish"
				},
				{
					"url": "/products/sphere-black.jpg",
					"kind": "image",
					"alt": "Black sphere"
				},
				{
					"url": "/products/squish-flex.gif",
					"kind": "gif",
					"alt": "Flex"
				},
				{
					"url": "/products/macro.jpg",
					"kind": "image",
					"alt": "Lattice"
				}
			],
			"shapes": [
				{
					"id": "sphere",
					"label": "Ball / Sphere",
					"priceDelta": 0,
					"g3dpgValue": "sphere"
				},
				{
					"id": "gumdrop",
					"label": "Gumdrop",
					"priceDelta": 0,
					"g3dpgValue": "gumdrop"
				},
				{
					"id": "cube",
					"label": "Square / Cube",
					"priceDelta": 0,
					"g3dpgValue": "cube"
				}
			],
			"colors": [
				{
					"id": "black",
					"label": "Black",
					"hex": "#171717",
					"priceDelta": 0,
					"imageUrl": "/products/sphere-black.jpg"
				},
				{
					"id": "red",
					"label": "Red",
					"hex": "#c2302a",
					"priceDelta": 0
				},
				{
					"id": "white",
					"label": "White",
					"hex": "#f4f1ea",
					"priceDelta": 0,
					"imageUrl": "/products/sphere.jpg"
				},
				{
					"id": "blue",
					"label": "Blue",
					"hex": "#1e4f8f",
					"priceDelta": 0
				},
				{
					"id": "yellow",
					"label": "Yellow",
					"hex": "#d9a800",
					"priceDelta": 0
				},
				{
					"id": "orange",
					"label": "Orange",
					"hex": "#e06a2c",
					"priceDelta": 0
				}
			],
			"firmnessOptions": [
				{
					"id": "super-soft",
					"label": "Super Soft",
					"priceDelta": 0,
					"meta": {
						"thickness": .8,
						"periods": 2
					}
				},
				{
					"id": "soft",
					"label": "Soft",
					"priceDelta": 0,
					"meta": {
						"thickness": 1.2,
						"periods": 2.2
					}
				},
				{
					"id": "medium",
					"label": "Medium",
					"priceDelta": 200,
					"meta": {
						"thickness": 1.5,
						"periods": 2.5
					}
				},
				{
					"id": "firm",
					"label": "Firm",
					"priceDelta": 300,
					"meta": {
						"thickness": 2.1,
						"periods": 2.8
					}
				}
			],
			"textureEnabled": true,
			"textureOptions": [
				{
					"id": "none",
					"label": "Smooth",
					"priceDelta": 0,
					"meta": {
						"toggle": false,
						"amount": 0
					}
				},
				{
					"id": "light",
					"label": "Light grain",
					"priceDelta": 100,
					"meta": {
						"toggle": true,
						"amount": 25
					}
				},
				{
					"id": "moderate",
					"label": "Moderate",
					"priceDelta": 200,
					"meta": {
						"toggle": true,
						"amount": 50
					}
				}
			],
			"infillPattern": "gyroid",
			"sizeMm": 35,
			"extraSettings": {
				"quality": "192",
				"rounded": true,
				"cornerRadius": 4
			},
			"active": true,
			"sortOrder": 1
		},
		{
			"id": "prod_ring_squish",
			"lineId": "line_g3d_squish",
			"slug": "ring",
			"name": "Ring Squish",
			"description": "A torus printed as a continuous gyroid. Fingers find the hole; the lattice still yields. Built around the Ring / Torus toolpath in G3DPG, with the rest of the Squish palette available.",
			"basePriceCents": 3200,
			"imageUrl": "/products/ring.jpg",
			"gifUrl": "",
			"videoUrl": "",
			"gallery": [
				{
					"url": "/products/ring.jpg",
					"kind": "image",
					"alt": "Ring Squish"
				},
				{
					"url": "/products/cylinder.jpg",
					"kind": "image",
					"alt": "Cylinder cousin"
				},
				{
					"url": "/products/macro.jpg",
					"kind": "image",
					"alt": "Gyroid"
				}
			],
			"shapes": [
				{
					"id": "ring",
					"label": "Ring / Torus",
					"priceDelta": 0,
					"g3dpgValue": "ring"
				},
				{
					"id": "cylinder",
					"label": "Cylinder",
					"priceDelta": 0,
					"g3dpgValue": "cylinder"
				},
				{
					"id": "cube",
					"label": "Square / Cube",
					"priceDelta": 200,
					"g3dpgValue": "cube"
				}
			],
			"colors": [
				{
					"id": "black",
					"label": "Black",
					"hex": "#171717",
					"priceDelta": 0
				},
				{
					"id": "red",
					"label": "Red",
					"hex": "#c2302a",
					"priceDelta": 0
				},
				{
					"id": "white",
					"label": "White",
					"hex": "#f4f1ea",
					"priceDelta": 0,
					"imageUrl": "/products/ring.jpg"
				},
				{
					"id": "blue",
					"label": "Blue",
					"hex": "#1e4f8f",
					"priceDelta": 0
				},
				{
					"id": "yellow",
					"label": "Yellow",
					"hex": "#d9a800",
					"priceDelta": 0
				},
				{
					"id": "orange",
					"label": "Orange",
					"hex": "#e06a2c",
					"priceDelta": 0
				}
			],
			"firmnessOptions": [
				{
					"id": "soft",
					"label": "Soft",
					"priceDelta": 0,
					"meta": {
						"thickness": 1.2,
						"periods": 2.2
					}
				},
				{
					"id": "medium",
					"label": "Medium",
					"priceDelta": 200,
					"meta": {
						"thickness": 1.5,
						"periods": 2.5
					}
				},
				{
					"id": "firm",
					"label": "Firm",
					"priceDelta": 300,
					"meta": {
						"thickness": 2.1,
						"periods": 2.8
					}
				},
				{
					"id": "super-firm",
					"label": "Super Firm",
					"priceDelta": 500,
					"meta": {
						"thickness": 2.8,
						"periods": 3.2
					}
				}
			],
			"textureEnabled": true,
			"textureOptions": [
				{
					"id": "none",
					"label": "Smooth",
					"priceDelta": 0,
					"meta": {
						"toggle": false,
						"amount": 0
					}
				},
				{
					"id": "light",
					"label": "Light grain",
					"priceDelta": 100,
					"meta": {
						"toggle": true,
						"amount": 25
					}
				},
				{
					"id": "moderate",
					"label": "Moderate",
					"priceDelta": 200,
					"meta": {
						"toggle": true,
						"amount": 50
					}
				},
				{
					"id": "heavy",
					"label": "Heavy grain",
					"priceDelta": 400,
					"meta": {
						"toggle": true,
						"amount": 85
					}
				}
			],
			"infillPattern": "gyroid",
			"sizeMm": 50,
			"extraSettings": { "quality": "192" },
			"active": true,
			"sortOrder": 2
		}
	]
};
var ADMIN_CODE = process.env.G3D_ADMIN_PASSCODE?.trim() || "2004051315";
var GH_TOKEN = process.env.G3D_GITHUB_TOKEN?.trim();
var GH_OWNER = process.env.G3D_GITHUB_OWNER?.trim() || "methatsmeyesitsme";
var GH_REPO = process.env.G3D_GITHUB_REPO?.trim() || "G3D-Orders";
var GH_BRANCH = process.env.G3D_GITHUB_BRANCH?.trim() || "main";
var CATALOG_PATH = "data/catalog.json";
function assertAdminAccess(code) {
	if (code !== ADMIN_CODE) throw new Error("Admin access denied");
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
async function getGithubFile(path) {
	return ghJson(`/contents/${path}?ref=${encodeURIComponent(GH_BRANCH)}`);
}
async function readCatalog() {
	assertStoreAccess();
	const [saved] = await db.select({ catalog: g3dCatalogState.catalog }).from(g3dCatalogState).where(eq(g3dCatalogState.id, "primary")).limit(1);
	if (saved) return saved.catalog;
	try {
		return JSON.parse(decodeGithubContent((await getGithubFile(CATALOG_PATH)).content));
	} catch {
		return catalog_default;
	}
}
async function writeCatalog(catalog, _message) {
	await db.insert(g3dCatalogState).values({
		id: "primary",
		catalog
	}).onConflictDoUpdate({
		target: g3dCatalogState.id,
		set: {
			catalog,
			updatedAt: /* @__PURE__ */ new Date()
		}
	});
}
async function nextOrderNumber() {
	const rows = await db.select({ orderNumber: g3dStoreOrders.orderNumber }).from(g3dStoreOrders);
	const used = new Set(rows.map((row) => row.orderNumber));
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
var checkStoreAccess_createServerFn_handler = createServerRpc({
	id: "2487fafcb0a6afff41602b0963af592618faf0b672e0218cebccca18b2f44a26",
	name: "checkStoreAccess",
	filename: "src/lib/store.functions.ts"
}, (opts) => checkStoreAccess.__executeServer(opts));
var checkStoreAccess = createServerFn({ method: "GET" }).handler(checkStoreAccess_createServerFn_handler, async () => hasStoreAccess());
var unlockStore_createServerFn_handler = createServerRpc({
	id: "57ba7a2370dca1c25893bb8850e8d5891fd6da35c025e21fa0b618f29a2a5d25",
	name: "unlockStore",
	filename: "src/lib/store.functions.ts"
}, (opts) => unlockStore.__executeServer(opts));
var unlockStore = createServerFn({ method: "POST" }).validator(objectType({ code: stringType().trim().min(1).max(100) })).handler(unlockStore_createServerFn_handler, async ({ data }) => {
	const result = verifyStoreCode(data.code);
	if (result !== "valid") return {
		ok: false,
		reason: result
	};
	setStoreAccessCookie();
	return { ok: true };
});
var verifyAdminCode_createServerFn_handler = createServerRpc({
	id: "8b9db708be573863088f03ff45d5b88c981412c12401cf334d9fb1c2298088cd",
	name: "verifyAdminCode",
	filename: "src/lib/store.functions.ts"
}, (opts) => verifyAdminCode.__executeServer(opts));
var verifyAdminCode = createServerFn({ method: "POST" }).validator(objectType({ code: stringType() })).handler(verifyAdminCode_createServerFn_handler, async ({ data }) => {
	assertStoreAccess();
	if (data.code !== ADMIN_CODE) throw new Error("That admin code is not valid.");
	return { ok: true };
});
var listLines_createServerFn_handler = createServerRpc({
	id: "74476a4ccb59e9866473845740bc7176a0c5cb5e8ef70634d2ac492afe62229f",
	name: "listLines",
	filename: "src/lib/store.functions.ts"
}, (opts) => listLines.__executeServer(opts));
var listLines = createServerFn({ method: "GET" }).handler(listLines_createServerFn_handler, async () => {
	assertStoreAccess();
	return (await readCatalog()).lines.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
});
var getLineBySlug_createServerFn_handler = createServerRpc({
	id: "0415884af848bd3da7e3fbe5dee23e09230c5ea32497d59bf555dcfb6458ebd9",
	name: "getLineBySlug",
	filename: "src/lib/store.functions.ts"
}, (opts) => getLineBySlug.__executeServer(opts));
var getLineBySlug = createServerFn({ method: "GET" }).validator(objectType({ slug: stringType() })).handler(getLineBySlug_createServerFn_handler, async ({ data }) => {
	assertStoreAccess();
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
	assertStoreAccess();
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
	assertStoreAccess();
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
	await db.insert(g3dStoreOrders).values({
		id: orderId,
		orderNumber: number,
		orderData: order,
		createdAt: new Date(now)
	});
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
	assertStoreAccess();
	const [row] = await db.select({ orderData: g3dStoreOrders.orderData }).from(g3dStoreOrders).where(eq(g3dStoreOrders.orderNumber, data.orderNumber)).limit(1);
	return row ? row.orderData : null;
});
var listOrders_createServerFn_handler = createServerRpc({
	id: "136944701bc969aa8ada70fb7ca5938c4c1975bb114752711a9c68048237076a",
	name: "listOrders",
	filename: "src/lib/store.functions.ts"
}, (opts) => listOrders.__executeServer(opts));
var listOrders = createServerFn({ method: "POST" }).validator(objectType({ adminCode: stringType() })).handler(listOrders_createServerFn_handler, async ({ data }) => {
	assertStoreAccess();
	assertAdminAccess(data.adminCode);
	return (await db.select({ orderData: g3dStoreOrders.orderData }).from(g3dStoreOrders).orderBy(desc(g3dStoreOrders.createdAt))).map((row) => row.orderData);
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
	assertStoreAccess();
	assertAdminAccess(data.adminCode);
	const [row] = await db.select({ orderData: g3dStoreOrders.orderData }).from(g3dStoreOrders).where(eq(g3dStoreOrders.id, data.orderId)).limit(1);
	if (!row) throw new Error("Order not found.");
	const order = row.orderData;
	await db.update(g3dStoreOrders).set({ orderData: {
		...order,
		status: data.status
	} }).where(eq(g3dStoreOrders.id, data.orderId));
	return { ok: true };
});
var listCatalog_createServerFn_handler = createServerRpc({
	id: "ff64f0e539c6dab903b2b80e19f28ffc6b2cc3685e3220f5c705a3152f375c1c",
	name: "listCatalog",
	filename: "src/lib/store.functions.ts"
}, (opts) => listCatalog.__executeServer(opts));
var listCatalog = createServerFn({ method: "POST" }).validator(objectType({ adminCode: stringType() })).handler(listCatalog_createServerFn_handler, async ({ data }) => {
	assertStoreAccess();
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
export { checkStoreAccess_createServerFn_handler, createProductFromTemplate_createServerFn_handler, deleteLine_createServerFn_handler, deleteProduct_createServerFn_handler, getLineBySlug_createServerFn_handler, getOrderByNumber_createServerFn_handler, getProductBySlug_createServerFn_handler, listCatalog_createServerFn_handler, listLines_createServerFn_handler, listOrders_createServerFn_handler, cn as n, placeOrder_createServerFn_handler, formatMoney as r, __exportAll as t, unlockStore_createServerFn_handler, updateOrderStatus_createServerFn_handler, upsertLine_createServerFn_handler, upsertProduct_createServerFn_handler, verifyAdminCode_createServerFn_handler };
