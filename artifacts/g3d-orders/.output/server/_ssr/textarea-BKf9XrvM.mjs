import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as cn } from "./store.functions-DgdVEH25.mjs";
import { t as Input } from "./input-C_9SzDEd.mjs";
import { t as Label } from "./label-Dvc2icdl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/textarea-BKf9XrvM.js
var import_jsx_runtime = require_jsx_runtime();
function FileUrlField({ label, value, onChange, accept }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder: "https://… or /products/…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "file",
				accept: accept ?? "image/*,video/*,.gif",
				onChange: (event) => {
					const file = event.target.files?.[0];
					if (!file) return;
					const reader = new FileReader();
					reader.onload = () => {
						if (typeof reader.result === "string") onChange(reader.result);
					};
					reader.readAsDataURL(file);
				}
			})
		]
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-lg border border-input bg-card px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
//#endregion
export { Textarea as n, FileUrlField as t };
