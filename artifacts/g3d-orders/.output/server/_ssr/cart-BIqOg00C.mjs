import { o as __toESM } from "../_runtime.mjs";
import { d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, l as Dialog$1, m as DialogPortal$1, p as DialogOverlay$1, u as DialogClose, v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, r as formatMoney } from "./store.functions-DgdVEH25.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as placeOrder } from "./router-DKuHnLMn.mjs";
import { t as Button } from "./button-BPlrkmR0.mjs";
import { t as Input } from "./input-C_9SzDEd.mjs";
import { t as Label } from "./label-Dvc2icdl.mjs";
import { n as cartTotal, r as useCart, t as SiteShell } from "./site-shell-C5cMkjzu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-BIqOg00C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg max-h-[85vh] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function CartPage() {
	const items = useCart((s) => s.items);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const clear = useCart((s) => s.clear);
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)(() => items[0]?.selection.personalization ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [confirmation, setConfirmation] = (0, import_react.useState)(null);
	const total = cartTotal(items);
	async function checkout() {
		if (!name.trim()) {
			toast.error("Enter the name for this order.");
			return;
		}
		setBusy(true);
		try {
			const result = await placeOrder({ data: {
				customerName: name.trim(),
				items: items.map((item) => ({
					productId: item.productId,
					productName: item.productName,
					lineName: item.lineName,
					shape: item.selection.shape,
					color: item.selection.color,
					firmness: item.selection.firmness,
					texture: item.selection.texture,
					quantity: item.selection.quantity,
					unitPriceCents: item.unitPriceCents,
					personalization: item.selection.personalization,
					g3dpg: item.g3dpg
				}))
			} });
			clear();
			setConfirmation({
				orderNumber: result.orderNumber,
				totalCents: result.totalCents
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not place order");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl font-semibold",
			children: "Cart"
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-6 text-muted-foreground",
			children: [
				"Empty.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-foreground underline",
					children: "Browse the store"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 space-y-6",
			children: [
				items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.imageUrl,
						alt: "",
						className: "size-20 rounded-md object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: item.productName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									item.selection.shape,
									" · ",
									item.selection.color,
									" ·",
									" ",
									item.selection.firmness,
									item.selection.texture ? ` · ${item.selection.texture}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["For ", item.selection.personalization]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-10 w-20",
										type: "number",
										min: 1,
										value: item.selection.quantity,
										onChange: (e) => setQty(item.key, Number(e.target.value) || 1)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-sm text-muted-foreground hover:text-foreground",
										onClick: () => remove(item.key),
										children: "Remove"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "ml-auto tabular-nums",
										children: formatMoney(item.unitPriceCents * item.selection.quantity)
									})
								]
							})
						]
					})]
				}, item.key)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "order-name",
						children: "Name on the order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "order-name",
						value: name,
						onChange: (e) => setName(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border pt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl font-semibold tabular-nums",
						children: formatMoney(total)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					size: "lg",
					disabled: busy,
					onClick: () => void checkout(),
					children: busy ? "Placing…" : "Place order"
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: confirmation !== null,
		onOpenChange: (open) => {
			if (!open) setConfirmation(null);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Order received" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Your order has been saved. Keep this order number for reference." })] }),
			confirmation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-muted p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Order number"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-semibold",
						children: confirmation.orderNumber
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: ["Total: ", formatMoney(confirmation.totalCents)]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [confirmation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => void navigate({
					to: "/order/$orderNumber",
					params: { orderNumber: confirmation.orderNumber }
				}),
				children: "View order"
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setConfirmation(null),
				children: "Done"
			})] })
		] })
	})] });
}
//#endregion
export { CartPage as component };
