import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as Link, h as require_jsx_runtime, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAdminAccess } from "./admin-access-store-Y6OO6fCX.mjs";
import { t as Button } from "./button-DE-gFGKn.mjs";
import { t as Input } from "./input-C_9SzDEd.mjs";
import { t as Label } from "./label-Dvc2icdl.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as listCatalog, g as upsertLine, i as Route$2 } from "./router-hAw-ZWr2.mjs";
import { n as Textarea, t as FileUrlField } from "./textarea-BKf9XrvM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/line._id-49NSOOiA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LineEditor() {
	const { id } = Route$2.useParams();
	const adminCode = useAdminAccess((s) => s.code);
	const navigate = useNavigate();
	const [line, setLine] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		listCatalog({ data: { adminCode } }).then((catalog) => {
			setLine(catalog.lines.find((item) => item.id === id) ?? null);
		});
	}, [adminCode, id]);
	if (!line) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl px-4 py-16 text-sm text-muted-foreground",
		children: "Loading line…"
	});
	async function save() {
		const current = line;
		if (!current) return;
		setBusy(true);
		try {
			await upsertLine({ data: {
				adminCode,
				id: current.id,
				name: current.name,
				slug: current.slug,
				tagline: current.tagline,
				description: current.description,
				coverImageUrl: current.coverImageUrl,
				coverGifUrl: current.coverGifUrl,
				sortOrder: current.sortOrder
			} });
			toast.success("Line saved");
			navigate({ to: "/admin/catalog" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Save failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-2xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/catalog",
				className: "text-sm text-muted-foreground",
				children: "Catalog"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-semibold",
				children: "Edit line"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: line.name,
							onChange: (e) => setLine({
								...line,
								name: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: line.slug,
							onChange: (e) => setLine({
								...line,
								slug: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tagline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: line.tagline,
							onChange: (e) => setLine({
								...line,
								tagline: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: line.description,
							onChange: (e) => setLine({
								...line,
								description: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sort" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: line.sortOrder,
							onChange: (e) => setLine({
								...line,
								sortOrder: Number(e.target.value) || 0
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUrlField, {
						label: "Cover picture",
						value: line.coverImageUrl,
						accept: "image/*",
						onChange: (coverImageUrl) => setLine({
							...line,
							coverImageUrl
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUrlField, {
						label: "Cover GIF / video",
						value: line.coverGifUrl,
						accept: "image/gif,video/*",
						onChange: (coverGifUrl) => setLine({
							...line,
							coverGifUrl
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void save(),
						children: busy ? "Saving…" : "Save line"
					})
				]
			})
		]
	});
}
//#endregion
export { LineEditor as component };
