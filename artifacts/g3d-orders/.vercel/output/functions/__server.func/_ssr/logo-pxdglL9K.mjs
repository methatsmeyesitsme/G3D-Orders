import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as cn } from "./store.functions-DED96Pen.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-pxdglL9K.js
var import_jsx_runtime = require_jsx_runtime();
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 32 32",
		className: cn("text-accent", className),
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M16 3.2 28 10v12L16 28.8 4 22V10L16 3.2Zm0 3.1L7.2 11.2v9.6L16 25.7l8.8-4.9v-9.6L16 6.3Zm0 3.4 5.6 3.1v1.8L16 17.8l-5.6-3.2v-1.8L16 9.7Zm-4.4 6.4 4.4 2.5v5.1l-4.4-2.5v-5.1Zm8.8 0v5.1l-4.4 2.5v-5.1l4.4-2.5Z"
		})
	});
}
function Wordmark({ subtitle = "Orders", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-baseline gap-2", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-6 self-center" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-lg font-semibold tracking-tight",
				children: "G3D"
			}),
			subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
				children: subtitle
			}) : null
		]
	});
}
//#endregion
export { Wordmark as t };
