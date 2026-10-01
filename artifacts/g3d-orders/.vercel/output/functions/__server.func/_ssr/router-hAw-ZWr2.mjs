import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as HeadContent, c as Outlet, d as createRootRoute, g as notFound, h as require_jsx_runtime, i as Scripts, l as lazyRouteComponent, m as useRouter, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as numberType, c as unionType, i as literalType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store.functions-COVIzqoB.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var verifyAdminCode = createServerFn({ method: "POST" }).validator(objectType({ code: stringType() })).handler(createSsrRpc("8b9db708be573863088f03ff45d5b88c981412c12401cf334d9fb1c2298088cd"));
var listLines = createServerFn({ method: "GET" }).handler(createSsrRpc("74476a4ccb59e9866473845740bc7176a0c5cb5e8ef70634d2ac492afe62229f"));
var getLineBySlug = createServerFn({ method: "GET" }).validator(objectType({ slug: stringType() })).handler(createSsrRpc("0415884af848bd3da7e3fbe5dee23e09230c5ea32497d59bf555dcfb6458ebd9"));
var getProductBySlug = createServerFn({ method: "GET" }).validator(objectType({
	lineSlug: stringType(),
	productSlug: stringType()
})).handler(createSsrRpc("6d01fe2bca3c1a6af7afcd2612bbeff16bd5dd41b13a9a41739f3936ece00113"));
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
var placeOrder = createServerFn({ method: "POST" }).validator(objectType({
	customerName: stringType().min(1).max(80),
	items: arrayType(cartItemSchema).min(1)
})).handler(createSsrRpc("90954bf6eb46204d3fcbe413f4732bb8c7d7db678553e104ffa92a324b365bba"));
var getOrderByNumber = createServerFn({ method: "GET" }).validator(objectType({ orderNumber: stringType() })).handler(createSsrRpc("e0173ddb81d5be896c6961860650039db1c0e5e0b8b5c52053f6db11dbc980bf"));
var listOrders = createServerFn({ method: "POST" }).validator(objectType({ adminCode: stringType() })).handler(createSsrRpc("136944701bc969aa8ada70fb7ca5938c4c1975bb114752711a9c68048237076a"));
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
})).handler(createSsrRpc("72c96484af0296e5e44d41d7449cebf87722fa1c70237c24475e222f19f8deaf"));
var listCatalog = createServerFn({ method: "POST" }).validator(objectType({ adminCode: stringType() })).handler(createSsrRpc("ff64f0e539c6dab903b2b80e19f28ffc6b2cc3685e3220f5c705a3152f375c1c"));
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
})).handler(createSsrRpc("e54e178a45bc56d0642e3a07fcf18474ac75a57b706dfa7d7d5ca21b17cc8a32"));
var deleteLine = createServerFn({ method: "POST" }).validator(objectType({
	adminCode: stringType(),
	id: stringType()
})).handler(createSsrRpc("30e9a5bb272f8376555743636b8f80f5cf65616cb595ce50f52e9135fbdac70d"));
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
})).handler(createSsrRpc("cacb72a1a3f0b961deb7ef8344fce55b23b11d48d79887d1d85340efcd1d0647"));
var deleteProduct = createServerFn({ method: "POST" }).validator(objectType({
	adminCode: stringType(),
	id: stringType()
})).handler(createSsrRpc("cd02911c6606b71ebf66b532d825c6fd9886e0069512f83b6c44e180c98f0106"));
var createProductFromTemplate = createServerFn({ method: "POST" }).validator(objectType({
	adminCode: stringType(),
	lineId: stringType(),
	name: stringType().min(1).max(80)
})).handler(createSsrRpc("eb38f07e3c167710aaf657feadf5d6a084fd1f3213d59e5287d7c8d1169f25db"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-hAw-ZWr2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-destructive",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted-foreground",
				children: errorMessage(error)
			})
		]
	});
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = objectType({
	channel: literalType(PREVIEW_BRIDGE_CHANNEL),
	version: numberType().int().positive(),
	type: stringType().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literalType("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literalType("navigate"),
	path: stringType().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literalType("history"),
	delta: unionType([literalType(-1), literalType(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literalType("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-DhAN0nz-.css";
var APP_NAME = "G3D Orders";
var Route$13 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#F4F1EA"
			},
			{
				name: "description",
				content: "Private G3D studio desk for Squish orders and catalog."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Syne:wght@500;600;700&display=swap"
			}
		]
	}),
	errorComponent: AppErrorComponent,
	notFoundComponent: NotFound,
	component: RootDocument
});
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl font-semibold",
				children: "Not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "That page is not in the studio."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/",
				className: "mt-6 inline-flex h-11 items-center text-sm underline",
				children: "Back to store"
			})
		] })
	});
}
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "antialiased",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "top-center",
					richColors: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$10 = () => import("./routes-Dkh-o6ui.mjs");
var Route$12 = createFileRoute("/")({
	loader: async () => {
		const lines = await listLines();
		return {
			lines,
			featured: lines[0] ? await getLineBySlug({ data: { slug: lines[0].slug } }) : null
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin-DhpiiCtz.mjs");
var Route$11 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./cart-woyuwAR9.mjs");
var Route$10 = createFileRoute("/cart")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin-C8YmlIBv.mjs");
var Route$9 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./catalog-DwLYrV4j.mjs");
var Route$8 = createFileRoute("/admin/catalog")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./orders-wjHqS6c2.mjs");
var Route$7 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var UPSTREAM = "https://methatsmeyesitsme.github.io/Better-Bins";
var INJECT = `
<script id="g3d-order-inject">
(function () {
  var params = new URLSearchParams(location.search);
  if (!params.get("g3d") && !params.get("shape")) return;
  function setValue(id, value) {
    if (value == null || value === "") return;
    var el = document.getElementById(id);
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = value === "1" || value === "true";
    } else {
      el.value = value;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function applyRest() {
    setValue("p_size", params.get("size"));
    setValue("p_diameter", params.get("diameter"));
    setValue("p_height", params.get("height"));
    setValue("p_outerDiameter", params.get("outerDiameter"));
    setValue("p_tubeDiameter", params.get("tubeDiameter"));
    setValue("pattern", params.get("pattern"));
    setValue("quality", params.get("quality"));
    setValue("periods", params.get("periods"));
    setValue("thickness", params.get("thickness"));
    setValue("textureToggle", params.get("textureToggle"));
    setValue("textureAmount", params.get("textureAmount"));
    setValue("wallsToggle", params.get("wallsToggle"));
    setValue("wallThickness", params.get("wallThickness"));
    setValue("rounded", params.get("rounded"));
    setValue("cornerRadius", params.get("cornerRadius"));
    setValue("customName", params.get("customName"));
    var tab = document.getElementById("tabPG");
    if (tab) tab.click();
  }
  function apply() {
    setValue("shape", params.get("shape"));
    setTimeout(applyRest, 80);
    setTimeout(applyRest, 280);
    setTimeout(applyRest, 700);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
<\/script>`;
function contentTypeFor(path, fallback) {
	const lower = path.toLowerCase();
	if (lower.endsWith(".js")) return "application/javascript; charset=utf-8";
	if (lower.endsWith(".css")) return "text/css; charset=utf-8";
	if (lower.endsWith(".html")) return "text/html; charset=utf-8";
	if (lower.endsWith(".wasm")) return "application/wasm";
	if (lower.endsWith(".json")) return "application/json";
	if (lower.endsWith(".svg")) return "image/svg+xml";
	if (lower.endsWith(".png")) return "image/png";
	if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
	if (lower.endsWith(".woff2")) return "font/woff2";
	return fallback;
}
async function proxyG3dpg(splat, request) {
	const path = (splat ?? "").replace(/^\/+/, "");
	const isIndex = !path || path === "index.html";
	const incoming = new URL(request.url);
	const target = isIndex ? `${UPSTREAM}/${incoming.search}` : `${UPSTREAM}/${path}${incoming.search}`;
	let upstream;
	try {
		upstream = await fetch(target, {
			headers: {
				"User-Agent": request.headers.get("user-agent") ?? "G3D-Orders",
				Accept: request.headers.get("accept") ?? "*/*"
			},
			redirect: "follow"
		});
	} catch {
		if (!isIndex) return new Response("G3DPG asset unavailable", { status: 502 });
		return fallbackPage(incoming.search);
	}
	if (!upstream.ok && isIndex) return fallbackPage(incoming.search);
	const type = contentTypeFor(path || "index.html", upstream.headers.get("content-type") ?? "application/octet-stream");
	if (isIndex) {
		let html = await upstream.text();
		if (!html.includes("<base ")) html = html.replace("<head>", "<head>\n<base href=\"/g3dpg-app/\">");
		if (html.includes("</body>")) html = html.replace("</body>", `${INJECT}\n</body>`);
		else html += INJECT;
		return new Response(html, {
			status: 200,
			headers: {
				"Content-Type": "text/html; charset=utf-8",
				"Cache-Control": "no-store"
			}
		});
	}
	const body = await upstream.arrayBuffer();
	return new Response(body, {
		status: upstream.status,
		headers: {
			"Content-Type": type,
			"Cache-Control": "public, max-age=300"
		}
	});
}
function fallbackPage(search) {
	const direct = `https://methatsmeyesitsme.github.io/Better-Bins/${search}`;
	const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Open G3DPG</title>
<meta http-equiv="refresh" content="0;url=${direct}">
<style>body{font-family:system-ui;background:#17130f;color:#f1ede6;padding:48px;}</style>
</head><body>
<p>Opening G3DPG with this order…</p>
<p><a href="${direct}" style="color:#e07a3f">Continue to G3DPG</a></p>
</body></html>`;
	return new Response(html, {
		status: 200,
		headers: { "Content-Type": "text/html; charset=utf-8" }
	});
}
var Route$6 = createFileRoute("/g3dpg-app/")({ server: { handlers: { GET: ({ request }) => proxyG3dpg("", request) } } });
var Route$5 = createFileRoute("/g3dpg-app/$")({ server: { handlers: { GET: ({ request, params }) => proxyG3dpg(params._splat, request) } } });
var $$splitComponentImporter$4 = () => import("./line._slug-C6IUxmVm.mjs");
var Route$4 = createFileRoute("/line/$slug")({
	loader: async ({ params }) => {
		const data = await getLineBySlug({ data: { slug: params.slug } });
		if (!data) throw notFound();
		return data;
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./order._orderNumber-BgAjQ5cW.mjs");
var Route$3 = createFileRoute("/order/$orderNumber")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./line._id-49NSOOiA.mjs");
var Route$2 = createFileRoute("/admin/line/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./product._id-CVXkBiaH.mjs");
var Route$1 = createFileRoute("/admin/product/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./line._slug.p._productSlug-ClSxq9F7.mjs");
var Route = createFileRoute("/line/$slug/p/$productSlug")({
	loader: async ({ params }) => {
		const product = await getProductBySlug({ data: {
			lineSlug: params.slug,
			productSlug: params.productSlug
		} });
		if (!product) throw notFound();
		return { product };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AdminRoute = Route$11.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$13
});
var CartRoute = Route$10.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$13
});
var AdminIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminCatalogRoute = Route$8.update({
	id: "/catalog",
	path: "/catalog",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$7.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var G3dpgAppIndexRoute = Route$6.update({
	id: "/g3dpg-app/",
	path: "/g3dpg-app/",
	getParentRoute: () => Route$13
});
var G3dpgAppSplatRoute = Route$5.update({
	id: "/g3dpg-app/$",
	path: "/g3dpg-app/$",
	getParentRoute: () => Route$13
});
var LineSlugRoute = Route$4.update({
	id: "/line/$slug",
	path: "/line/$slug",
	getParentRoute: () => Route$13
});
var OrderOrderNumberRoute = Route$3.update({
	id: "/order/$orderNumber",
	path: "/order/$orderNumber",
	getParentRoute: () => Route$13
});
var AdminLineIdRoute = Route$2.update({
	id: "/line/$id",
	path: "/line/$id",
	getParentRoute: () => AdminRoute
});
var AdminProductIdRoute = Route$1.update({
	id: "/product/$id",
	path: "/product/$id",
	getParentRoute: () => AdminRoute
});
var LineSlugPProductSlugRoute = Route.update({
	id: "/p/$productSlug",
	path: "/p/$productSlug",
	getParentRoute: () => LineSlugRoute
});
var AdminRouteChildren = {
	AdminCatalogRoute,
	AdminOrdersRoute,
	AdminIndexRoute,
	AdminLineIdRoute,
	AdminProductIdRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var LineSlugRouteChildren = { LineSlugPProductSlugRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	CartRoute,
	G3dpgAppSplatRoute,
	LineSlugRoute: LineSlugRoute._addFileChildren(LineSlugRouteChildren),
	OrderOrderNumberRoute,
	G3dpgAppIndexRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		basepath: "/",
		defaultPreload: "intent",
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { upsertProduct as _, Route$3 as a, createProductFromTemplate as c, getOrderByNumber as d, listCatalog as f, upsertLine as g, updateOrderStatus as h, Route$2 as i, deleteLine as l, placeOrder as m, Route as n, Route$4 as o, listOrders as p, Route$1 as r, Route$12 as s, router_exports as t, deleteProduct as u, verifyAdminCode as v };
