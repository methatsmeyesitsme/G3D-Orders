import { t as cn } from "./utils-Doa1GMob.mjs";
import { h as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-C_9SzDEd.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-md border border-input bg-card px-3 text-base text-foreground shadow-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
//#endregion
export { Input as t };
