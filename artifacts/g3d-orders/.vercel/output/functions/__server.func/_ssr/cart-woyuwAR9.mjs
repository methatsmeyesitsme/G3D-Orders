import { i as __toESM } from "../_runtime.mjs";
import { n as formatMoney } from "./utils-Doa1GMob.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as Link, h as require_jsx_runtime, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DE-gFGKn.mjs";
import { t as Input } from "./input-C_9SzDEd.mjs";
import { t as Label } from "./label-Dvc2icdl.mjs";
import { n as cartTotal, r as useCart, t as SiteShell } from "./site-shell-BuAsztQH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as placeOrder } from "./router-hAw-ZWr2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-woyuwAR9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const items = useCart((s) => s.items);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const clear = useCart((s) => s.clear);
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)(() => items[0]?.selection.personalization ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
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
			toast.success(`Order ${result.orderNumber} is in.`);
			navigate({
				to: "/order/$orderNumber",
				params: { orderNumber: result.orderNumber }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not place order");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
	}) });
}
//#endregion
export { CartPage as component };
