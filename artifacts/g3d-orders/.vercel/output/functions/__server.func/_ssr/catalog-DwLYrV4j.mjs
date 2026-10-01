import { i as __toESM } from "../_runtime.mjs";
import { n as formatMoney } from "./utils-Doa1GMob.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as Link, h as require_jsx_runtime, m as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAdminAccess } from "./admin-access-store-Y6OO6fCX.mjs";
import { t as Button } from "./button-DE-gFGKn.mjs";
import { t as Input } from "./input-C_9SzDEd.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as createProductFromTemplate, f as listCatalog, g as upsertLine, l as deleteLine, u as deleteProduct } from "./router-hAw-ZWr2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-DwLYrV4j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CatalogPage() {
	const adminCode = useAdminAccess((s) => s.code);
	const router = useRouter();
	const [lines, setLines] = (0, import_react.useState)([]);
	const [products, setProducts] = (0, import_react.useState)([]);
	const [newLine, setNewLine] = (0, import_react.useState)("");
	async function refresh() {
		const catalog = await listCatalog({ data: { adminCode } });
		setLines(catalog.lines);
		setProducts(catalog.products);
	}
	(0, import_react.useEffect)(() => {
		refresh();
	}, [adminCode]);
	async function addLine() {
		if (!newLine.trim()) return;
		try {
			const created = await upsertLine({ data: {
				adminCode,
				name: newLine.trim(),
				slug: newLine.trim(),
				tagline: "",
				description: "",
				coverImageUrl: "",
				coverGifUrl: "",
				sortOrder: lines.length
			} });
			setNewLine("");
			toast.success("Line created");
			await refresh();
			router.navigate({
				to: "/admin/line/$id",
				params: { id: created.id }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not create line");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Catalog"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Add lines and products from here. No code edits."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "New product line name",
					value: newLine,
					onChange: (e) => setNewLine(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void addLine(),
					children: "Create line"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-8",
				children: lines.map((line) => {
					const lineProducts = products.filter((p) => p.lineId === line.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-semibold",
								children: line.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["/", line.slug]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/line/$id",
											params: { id: line.id },
											children: "Edit line"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: async () => {
											const name = window.prompt("Product name?");
											if (!name) return;
											const created = await createProductFromTemplate({ data: {
												adminCode,
												lineId: line.id,
												name
											} });
											await refresh();
											router.navigate({
												to: "/admin/product/$id",
												params: { id: created.id }
											});
										},
										children: "Add product"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: async () => {
											if (!window.confirm(`Remove ${line.name}?`)) return;
											await deleteLine({ data: {
												adminCode,
												id: line.id
											} });
											await refresh();
										},
										children: "Delete"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 divide-y divide-border",
							children: [lineProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center justify-between gap-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: product.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [formatMoney(product.basePriceCents), product.active ? "" : " · hidden"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/product/$id",
											params: { id: product.id },
											children: "Edit"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: async () => {
											if (!window.confirm(`Remove ${product.name}?`)) return;
											await deleteProduct({ data: {
												adminCode,
												id: product.id
											} });
											await refresh();
										},
										children: "Delete"
									})]
								})]
							}, product.id)), lineProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "py-4 text-sm text-muted-foreground",
								children: "No products in this line yet."
							}) : null]
						})]
					}, line.id);
				})
			})
		]
	});
}
//#endregion
export { CatalogPage as component };
