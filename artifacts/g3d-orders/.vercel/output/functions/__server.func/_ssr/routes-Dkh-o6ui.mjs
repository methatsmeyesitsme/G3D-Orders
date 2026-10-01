import { n as formatMoney } from "./utils-Doa1GMob.mjs";
import { f as Link, h as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SiteShell } from "./site-shell-BuAsztQH.mjs";
import { s as Route$12 } from "./router-hAw-ZWr2.mjs";
import { t as MediaFrame } from "./media-frame-VKPcZ4AB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dkh-o6ui.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { lines, featured } = Route$12.useLoaderData();
	const cover = featured?.line.coverGifUrl || featured?.line.coverImageUrl;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.28em] text-accent",
					children: "Product studio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.05] sm:text-6xl",
					children: "Lattice you can hold."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-md text-base text-muted-foreground",
					children: "G3D Squish is printed to the options on the ticket. Shape, filament, yield, grain — then GO sends the same spec into G3DPG."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl shadow-[var(--shadow-border)]",
				children: cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[16/10] sm:aspect-[16/9]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
						src: cover,
						kind: featured?.line.coverGifUrl ? "gif" : "image",
						alt: "G3D Squish"
					})
				}) : null
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex items-end justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold",
					children: "Product lines"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2",
				children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/line/$slug",
					params: { slug: line.slug },
					className: "group overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[16/10] overflow-hidden bg-paper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
							src: line.coverImageUrl,
							alt: line.name,
							className: "transition-transform duration-500 group-hover:scale-[1.03]"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl font-semibold",
							children: line.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: line.tagline
						})]
					})]
				}, line.id))
			})]
		}),
		featured?.products.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-card/50",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl font-semibold",
					children: ["In ", featured.line.name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-5 sm:grid-cols-3",
					children: featured.products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/line/$slug/p/$productSlug",
						params: {
							slug: featured.line.slug,
							productSlug: product.slug
						},
						className: "group overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-square bg-paper",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
								src: product.imageUrl,
								alt: product.name
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: product.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm tabular-nums text-muted-foreground",
								children: ["From ", formatMoney(product.basePriceCents)]
							})]
						})]
					}, product.id))
				})]
			})
		}) : null
	] });
}
//#endregion
export { Home as component };
