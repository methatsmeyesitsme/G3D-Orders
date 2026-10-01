import { o as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link, f as useNavigate, s as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./store.functions-DgdVEH25.mjs";
import { n as useAdminAccess } from "./admin-access-store-Y6OO6fCX.mjs";
import { t as Wordmark } from "./logo-pxdglL9K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DhpiiCtz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/admin",
		label: "Desk",
		exact: true
	},
	{
		to: "/admin/orders",
		label: "Orders"
	},
	{
		to: "/admin/catalog",
		label: "Catalog"
	}
];
function AdminShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { subtitle: "Admin" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex gap-1",
					children: [LINKS.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: link.to,
						activeOptions: link.exact ? { exact: true } : void 0,
						className: cn("inline-flex h-11 items-center rounded-md px-3 text-sm text-muted-foreground"),
						activeProps: { className: "inline-flex h-11 items-center rounded-md bg-secondary px-3 text-sm text-foreground" },
						children: link.label
					}, link.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex h-11 items-center px-3 text-sm text-muted-foreground",
						children: "Store"
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1",
			children
		})]
	});
}
function AdminLayout() {
	const navigate = useNavigate();
	const hydrated = useAdminAccess((s) => s.hydrated);
	const unlocked = useAdminAccess((s) => s.unlocked);
	const hydrate = useAdminAccess((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		if (hydrated && !unlocked) navigate({
			to: "/",
			replace: true
		});
	}, [
		hydrated,
		unlocked,
		navigate
	]);
	if (!hydrated || !unlocked) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AdminLayout as component };
