import { i as __toESM } from "../_runtime.mjs";
import { n as formatMoney } from "./utils-Doa1GMob.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as Link, h as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SiteShell } from "./site-shell-BuAsztQH.mjs";
import { a as Route$3, d as getOrderByNumber } from "./router-hAw-ZWr2.mjs";
import { t as StatusBadge } from "./status-badge-DLobkagq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._orderNumber-BgAjQ5cW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderPage() {
	const { orderNumber } = Route$3.useParams();
	const [state, setState] = (0, import_react.useState)({
		loading: true,
		order: null
	});
	(0, import_react.useEffect)(() => {
		let live = true;
		getOrderByNumber({ data: { orderNumber } }).then((order) => {
			if (!live) return;
			setState({
				loading: false,
				order
			});
		});
		return () => {
			live = false;
		};
	}, [orderNumber]);
	if (state.loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-lg px-4 py-16 text-muted-foreground",
		children: "Loading order…"
	}) });
	if (!state.order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 inline-block text-sm underline",
			children: "Back to store"
		})]
	}) });
	const order = state.order;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.2em] text-accent",
				children: "Order received"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold",
				children: order.orderNumber
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: order.status })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-muted-foreground",
				children: [
					"Filed for ",
					order.customerName,
					". It is on the G3D desk."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-3",
				children: order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-card p-4 text-sm shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: [
								item.quantity,
								" × ",
								item.productName
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								item.shape,
								" · ",
								item.color,
								" · ",
								item.firmness,
								" · ",
								item.texture
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular-nums",
							children: formatMoney(item.unitPriceCents * item.quantity)
						})
					]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-right font-display text-2xl tabular-nums",
				children: formatMoney(order.totalCents)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-8 inline-flex h-11 items-center text-sm underline",
				children: "Continue in the store"
			})
		]
	}) });
}
//#endregion
export { OrderPage as component };
