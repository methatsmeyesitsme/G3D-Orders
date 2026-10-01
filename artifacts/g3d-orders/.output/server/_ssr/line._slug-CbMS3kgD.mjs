import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatMoney } from "./store.functions-DgdVEH25.mjs";
import { o as Route$4 } from "./router-DKuHnLMn.mjs";
import { t as SiteShell } from "./site-shell-C5cMkjzu.mjs";
import { t as MediaFrame } from "./media-frame-VKPcZ4AB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/line._slug-CbMS3kgD.js
var import_jsx_runtime = require_jsx_runtime();
function LinePage() {
	const { line, products } = Route$4.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[4/3]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
					src: line.coverGifUrl || line.coverImageUrl,
					kind: line.coverGifUrl ? "gif" : "image",
					alt: line.name
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-end",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.28em] text-accent",
					children: "Product line"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl font-semibold sm:text-5xl",
					children: line.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-lg text-muted-foreground",
					children: line.tagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-prose text-sm leading-relaxed text-foreground/80",
					children: line.description
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/line/$slug/p/$productSlug",
				params: {
					slug: line.slug,
					productSlug: product.slug
				},
				className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-square bg-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
						src: product.imageUrl,
						alt: product.name
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 line-clamp-3 text-sm text-muted-foreground",
							children: product.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm tabular-nums",
							children: ["From ", formatMoney(product.basePriceCents)]
						})
					]
				})]
			}, product.id))
		})
	})] });
}
//#endregion
export { LinePage as component };
