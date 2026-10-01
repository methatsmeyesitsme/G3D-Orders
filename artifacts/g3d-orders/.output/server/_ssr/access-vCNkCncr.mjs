import { o as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as unlockStore, s as Route$12 } from "./router-DKuHnLMn.mjs";
import { t as Button } from "./button-BPlrkmR0.mjs";
import { t as Input } from "./input-C_9SzDEd.mjs";
import { t as Label } from "./label-Dvc2icdl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/access-vCNkCncr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StoreAccessPage() {
	const { next } = Route$12.useSearch();
	const [code, setCode] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setError("");
		setBusy(true);
		try {
			const result = await unlockStore({ data: { code } });
			if (!result.ok) {
				setError(result.reason === "not-configured" ? "Store access is not configured yet." : "That code is not correct.");
				return;
			}
			const destination = next.startsWith("/") && !next.startsWith("//") && next !== "/access" ? next : "/";
			window.location.replace(destination);
		} catch {
			setError("Could not verify the code. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background px-5 py-10 text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-sm rounded-2xl bg-card p-7 shadow-[var(--shadow-border)] sm:p-9",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.2em] text-accent",
					children: "G3D Orders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl font-semibold",
					children: "Store access"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Enter the access code to continue."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-7 space-y-4",
					onSubmit: (event) => void submit(event),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "store-access-code",
								children: "Access code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "store-access-code",
								type: "password",
								inputMode: "numeric",
								autoComplete: "one-time-code",
								value: code,
								onChange: (event) => setCode(event.target.value),
								required: true,
								autoFocus: true
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-sm text-destructive",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							type: "submit",
							disabled: busy,
							children: busy ? "Checking…" : "Enter store"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { StoreAccessPage as component };
