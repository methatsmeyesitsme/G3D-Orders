import { t as cn } from "./utils-Doa1GMob.mjs";
import { h as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-DLobkagq.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide", tone === "muted" && "bg-secondary text-muted-foreground", tone === "accent" && "bg-accent/12 text-accent", tone === "ok" && "bg-emerald-700/10 text-emerald-800", tone === "warn" && "bg-amber-700/10 text-amber-800", className),
		...props
	});
}
var TONE = {
	new: "accent",
	making: "warn",
	ready: "ok",
	completed: "muted",
	cancelled: "muted"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: TONE[status],
		className: "capitalize",
		children: status
	});
}
//#endregion
export { StatusBadge as t };
