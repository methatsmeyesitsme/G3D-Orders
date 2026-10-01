import { o as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as formatMoney } from "./store.functions-DgdVEH25.mjs";
import { _ as updateOrderStatus, m as listOrders } from "./router-DKuHnLMn.mjs";
import { t as Button } from "./button-BPlrkmR0.mjs";
import { n as useAdminAccess } from "./admin-access-store-Y6OO6fCX.mjs";
import { t as StatusBadge } from "./status-badge-DLobkagq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-Di-V9YBp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G3DPG_ORIGIN = "https://methatsmeyesitsme.github.io/Better-Bins/";
function buildG3dpgSearch(cfg) {
	const params = new URLSearchParams();
	params.set("g3d", "1");
	params.set("shape", cfg.shape);
	params.set("pattern", cfg.pattern);
	params.set("quality", cfg.quality);
	params.set("periods", cfg.periods);
	params.set("thickness", cfg.thickness);
	params.set("textureToggle", cfg.textureToggle ? "1" : "0");
	params.set("textureAmount", String(cfg.textureAmount));
	params.set("customName", cfg.customName);
	if (cfg.size) params.set("size", cfg.size);
	if (cfg.diameter) params.set("diameter", cfg.diameter);
	if (cfg.height) params.set("height", cfg.height);
	if (cfg.outerDiameter) params.set("outerDiameter", cfg.outerDiameter);
	if (cfg.tubeDiameter) params.set("tubeDiameter", cfg.tubeDiameter);
	if (cfg.wallsToggle != null) params.set("wallsToggle", cfg.wallsToggle ? "1" : "0");
	if (cfg.wallThickness) params.set("wallThickness", cfg.wallThickness);
	if (cfg.rounded != null) params.set("rounded", cfg.rounded ? "1" : "0");
	if (cfg.cornerRadius) params.set("cornerRadius", cfg.cornerRadius);
	if (cfg.color) params.set("color", cfg.color);
	if (cfg.firmness) params.set("firmness", cfg.firmness);
	if (cfg.texture) params.set("texture", cfg.texture);
	if (cfg.quantity) params.set("quantity", String(cfg.quantity));
	if (cfg.orderNumber) params.set("order", cfg.orderNumber);
	if (cfg.productName) params.set("product", cfg.productName);
	return params;
}
function g3dpgDirectUrl(cfg) {
	return `${G3DPG_ORIGIN}?${buildG3dpgSearch(cfg).toString()}`;
}
function openG3dpg(cfg) {
	const studio = g3dpgDirectUrl(cfg);
	if (!window.open(studio, "_blank", "noopener,noreferrer")) window.location.assign(studio);
}
var ORDER_STATUSES = [
	{
		id: "new",
		label: "New"
	},
	{
		id: "making",
		label: "Making"
	},
	{
		id: "ready",
		label: "Ready"
	},
	{
		id: "completed",
		label: "Completed"
	},
	{
		id: "cancelled",
		label: "Cancelled"
	}
];
function OrdersPage() {
	const adminCode = useAdminAccess((s) => s.code);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const refresh = (0, import_react.useCallback)(() => {
		return listOrders({ data: { adminCode } }).then(setOrders);
	}, [adminCode]);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	async function setStatus(orderId, status) {
		await updateOrderStatus({ data: {
			adminCode,
			orderId,
			status
		} });
		await refresh();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Orders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "GO sends shape, color, firmness, texture, name, and size into G3DPG."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4",
				children: [orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl font-semibold",
								children: order.orderNumber
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: order.customerName
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: order.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "tabular-nums",
									children: formatMoney(order.totalCents)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted-foreground",
								children: ["Status", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "ml-2 h-10 rounded-md border border-input bg-background px-2 text-sm",
									value: order.status,
									onChange: (e) => void setStatus(order.id, e.target.value),
									children: ORDER_STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: status.id,
										children: status.label
									}, status.id))
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[640px] text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-xs uppercase tracking-wide text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Product"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Shape"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Color"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Firmness"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Texture"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Qty"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Price"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2 font-medium" })
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.productName }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: item.personalization
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											children: item.shape
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											children: item.color
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											children: item.firmness
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											children: item.texture || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 tabular-nums",
											children: item.quantity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 tabular-nums",
											children: formatMoney(item.unitPriceCents * item.quantity)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "accent",
												onClick: () => openG3dpg({
													...item.g3dpg,
													orderNumber: order.orderNumber,
													customName: item.personalization || item.g3dpg.customName
												}),
												children: "GO"
											})
										})
									]
								}, item.id)) })]
							})
						})
					]
				}, order.id)), orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No orders yet."
				}) : null]
			})
		]
	});
}
//#endregion
export { OrdersPage as component };
