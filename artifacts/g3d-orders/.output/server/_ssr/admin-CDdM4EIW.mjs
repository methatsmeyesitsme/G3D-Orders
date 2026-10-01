import { o as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatMoney } from "./store.functions-DgdVEH25.mjs";
import { m as listOrders, p as listCatalog } from "./router-DKuHnLMn.mjs";
import { n as useAdminAccess } from "./admin-access-store-Y6OO6fCX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CDdM4EIW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	const adminCode = useAdminAccess((s) => s.code);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [lines, setLines] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listOrders({ data: { adminCode } }).then(setOrders);
		listCatalog({ data: { adminCode } }).then((c) => setLines(c.lines));
	}, [adminCode]);
	const open = orders.filter((o) => o.status === "new" || o.status === "making");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Orders land here. GO opens G3DPG with the exact spec."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open tickets",
						value: String(open.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "All orders",
						value: String(orders.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Product lines",
						value: String(lines.length)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/orders",
					className: "inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground",
					children: "Open orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/catalog",
					className: "inline-flex h-11 items-center rounded-md border border-border bg-card px-4 text-sm",
					children: "Edit catalog"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Latest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: [orders.slice(0, 6).map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: order.orderNumber
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: order.customerName
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular-nums text-sm",
							children: formatMoney(order.totalCents)
						})]
					}, order.id)), orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-8 text-sm text-muted-foreground",
						children: "No orders yet."
					}) : null]
				})]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-[0.16em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-display text-3xl font-semibold tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { AdminHome as component };
