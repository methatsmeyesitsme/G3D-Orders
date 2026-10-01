import { o as __toESM } from "../_runtime.mjs";
import { a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action, v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link, p as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, r as formatMoney } from "./store.functions-DED96Pen.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as deleteProduct, l as createProductFromTemplate, p as listCatalog, u as deleteLine, v as upsertLine } from "./router-ECGtCFA4.mjs";
import { n as buttonVariants, t as Button } from "./button-BPlrkmR0.mjs";
import { t as Input } from "./input-C_9SzDEd.mjs";
import { n as useAdminAccess } from "./admin-access-store-Y6OO6fCX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-CshlZWgy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function CatalogPage() {
	const adminCode = useAdminAccess((s) => s.code);
	const router = useRouter();
	const [lines, setLines] = (0, import_react.useState)([]);
	const [products, setProducts] = (0, import_react.useState)([]);
	const [newLine, setNewLine] = (0, import_react.useState)("");
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
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
	async function confirmDelete() {
		if (!deleteTarget) return;
		setDeleting(true);
		try {
			if (deleteTarget.kind === "line") await deleteLine({ data: {
				adminCode,
				id: deleteTarget.id
			} });
			else await deleteProduct({ data: {
				adminCode,
				id: deleteTarget.id
			} });
			toast.success(`${deleteTarget.name} deleted`);
			setDeleteTarget(null);
			await refresh();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not delete item");
		} finally {
			setDeleting(false);
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
										onClick: () => setDeleteTarget({
											kind: "line",
											id: line.id,
											name: line.name
										}),
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
										onClick: () => setDeleteTarget({
											kind: "product",
											id: product.id,
											name: product.name
										}),
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: deleteTarget !== null,
				onOpenChange: (open) => {
					if (!open && !deleting) setDeleteTarget(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Delete ",
					deleteTarget?.name,
					"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: deleteTarget?.kind === "line" ? "This permanently removes the product line and all products in it from this store." : "This permanently removes the product from this store." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: deleting,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					disabled: deleting,
					onClick: (event) => {
						event.preventDefault();
						confirmDelete();
					},
					children: deleting ? "Deleting…" : "Delete"
				})] })] })
			})
		]
	});
}
//#endregion
export { CatalogPage as component };
