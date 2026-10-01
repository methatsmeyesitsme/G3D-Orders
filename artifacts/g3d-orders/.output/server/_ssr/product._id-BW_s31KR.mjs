import { o as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, r as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { p as listCatalog, r as Route$1, y as upsertProduct } from "./router-DKuHnLMn.mjs";
import { t as Button } from "./button-BPlrkmR0.mjs";
import { t as Input } from "./input-C_9SzDEd.mjs";
import { t as Label } from "./label-Dvc2icdl.mjs";
import { n as useAdminAccess } from "./admin-access-store-Y6OO6fCX.mjs";
import { n as Textarea, t as FileUrlField } from "./textarea-BKf9XrvM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-BW_s31KR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function slugPart(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "option";
}
function OptionEditor({ title, hint, options, onChange, showHex, showG3d, kind }) {
	function patch(index, partial) {
		onChange(options.map((item, i) => i === index ? {
			...item,
			...partial
		} : item));
	}
	function patchMeta(index, key, value) {
		const current = options[index];
		patch(index, { meta: {
			...current.meta,
			[key]: value
		} });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-base font-semibold",
				children: title
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: hint
			}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => onChange([...options, {
					id: slugPart(`${title}-${options.length + 1}`),
					label: "New option",
					priceDelta: 0,
					...showHex ? { hex: "#888888" } : {},
					...showG3d ? { g3dpgValue: "" } : {},
					...kind === "firmness" ? { meta: {
						thickness: 1.5,
						periods: 2.5
					} } : {},
					...kind === "texture" ? { meta: {
						toggle: true,
						amount: 50
					} } : {}
				}]),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Add"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [options.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 rounded-lg bg-secondary/60 p-3 sm:grid-cols-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 sm:col-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: option.label,
							onChange: (e) => patch(index, { label: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Id" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: option.id,
							onChange: (e) => patch(index, { id: slugPart(e.target.value) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price ± cents" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: option.priceDelta,
							onChange: (e) => patch(index, { priceDelta: Number(e.target.value) || 0 })
						})]
					}),
					showHex ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Hex" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: option.hex ?? "",
							onChange: (e) => patch(index, { hex: e.target.value })
						})]
					}) : null,
					showG3d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "G3DPG value" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: option.g3dpgValue ?? "",
							onChange: (e) => patch(index, { g3dpgValue: e.target.value })
						})]
					}) : null,
					kind === "firmness" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Thickness mm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "0.1",
							value: Number(option.meta?.thickness ?? 1.5),
							onChange: (e) => patchMeta(index, "thickness", Number(e.target.value) || 1.5)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Periods" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "0.1",
							value: Number(option.meta?.periods ?? 2.5),
							onChange: (e) => patchMeta(index, "periods", Number(e.target.value) || 2.5)
						})]
					})] }) : null,
					kind === "texture" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount 0–100" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: Number(option.meta?.amount ?? 0),
							onChange: (e) => patchMeta(index, "amount", Number(e.target.value) || 0)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "col-span-2 flex items-end gap-2 text-sm sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: Boolean(option.meta?.toggle),
							onChange: (e) => patchMeta(index, "toggle", e.target.checked)
						}), "Enable texture"]
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-2 flex items-end justify-end sm:col-span-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							"aria-label": "Remove option",
							onClick: () => onChange(options.filter((_, i) => i !== index)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
						})
					}),
					showHex ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 sm:col-span-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Swatch photo URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: option.imageUrl ?? "",
							onChange: (e) => patch(index, { imageUrl: e.target.value })
						})]
					}) : null
				]
			}, `${option.id}-${index}`)), options.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No options yet."
			}) : null]
		})]
	});
}
function ProductEditor() {
	const { id } = Route$1.useParams();
	const adminCode = useAdminAccess((s) => s.code);
	const navigate = useNavigate();
	const [product, setProduct] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		listCatalog({ data: { adminCode } }).then((catalog) => {
			setProduct(catalog.products.find((item) => item.id === id) ?? null);
		});
	}, [adminCode, id]);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground",
		children: "Loading product…"
	});
	const extra = product.extraSettings ?? {};
	async function save() {
		const current = product;
		if (!current) return;
		setBusy(true);
		try {
			await upsertProduct({ data: {
				adminCode,
				id: current.id,
				lineId: current.lineId,
				name: current.name,
				slug: current.slug,
				description: current.description,
				basePriceCents: current.basePriceCents,
				imageUrl: current.imageUrl,
				gifUrl: current.gifUrl,
				videoUrl: current.videoUrl,
				gallery: current.gallery,
				shapes: current.shapes,
				colors: current.colors,
				firmnessOptions: current.firmnessOptions,
				textureEnabled: current.textureEnabled,
				textureOptions: current.textureOptions,
				infillPattern: current.infillPattern,
				sizeMm: current.sizeMm,
				extraSettings: current.extraSettings,
				active: current.active,
				sortOrder: current.sortOrder
			} });
			toast.success("Product saved");
			navigate({ to: "/admin/catalog" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Save failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/catalog",
				className: "text-sm text-muted-foreground",
				children: "Catalog"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-semibold",
				children: "Edit product"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: product.name,
								onChange: (e) => setProduct({
									...product,
									name: e.target.value
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: product.slug,
								onChange: (e) => setProduct({
									...product,
									slug: e.target.value
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: product.description,
							onChange: (e) => setProduct({
								...product,
								description: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Base price (cents)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: product.basePriceCents,
									onChange: (e) => setProduct({
										...product,
										basePriceCents: Number(e.target.value) || 0
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Size (mm)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: product.sizeMm,
									onChange: (e) => setProduct({
										...product,
										sizeMm: Number(e.target.value) || 50
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Infill pattern" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: product.infillPattern,
									onChange: (e) => setProduct({
										...product,
										infillPattern: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mesh quality" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(extra.quality ?? "192"),
								onChange: (e) => setProduct({
									...product,
									extraSettings: {
										...extra,
										quality: e.target.value
									}
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sort" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: product.sortOrder,
								onChange: (e) => setProduct({
									...product,
									sortOrder: Number(e.target.value) || 0
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: product.active,
							onChange: (e) => setProduct({
								...product,
								active: e.target.checked
							})
						}), "Visible in the store"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: product.textureEnabled,
							onChange: (e) => setProduct({
								...product,
								textureEnabled: e.target.checked
							})
						}), "Texture is available"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: Boolean(extra.rounded),
							onChange: (e) => setProduct({
								...product,
								extraSettings: {
									...extra,
									rounded: e.target.checked
								}
							})
						}), "Rounded edges in G3DPG"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUrlField, {
						label: "Main picture",
						value: product.imageUrl,
						accept: "image/*",
						onChange: (imageUrl) => setProduct({
							...product,
							imageUrl
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUrlField, {
						label: "GIF",
						value: product.gifUrl,
						accept: "image/gif",
						onChange: (gifUrl) => setProduct({
							...product,
							gifUrl
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUrlField, {
						label: "Video",
						value: product.videoUrl,
						accept: "video/*",
						onChange: (videoUrl) => setProduct({
							...product,
							videoUrl
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-semibold",
								children: "Gallery"
							}),
							product.gallery.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-[1fr_120px_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: item.url,
										onChange: (e) => {
											const gallery = product.gallery.map((g, i) => i === index ? {
												...g,
												url: e.target.value
											} : g);
											setProduct({
												...product,
												gallery
											});
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "h-11 rounded-md border border-input bg-background px-2 text-sm",
										value: item.kind,
										onChange: (e) => {
											const kind = e.target.value;
											const gallery = product.gallery.map((g, i) => i === index ? {
												...g,
												kind
											} : g);
											setProduct({
												...product,
												gallery
											});
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "image",
												children: "Image"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "gif",
												children: "GIF"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "video",
												children: "Video"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										onClick: () => setProduct({
											...product,
											gallery: product.gallery.filter((_, i) => i !== index)
										}),
										children: "Remove"
									})
								]
							}, index)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setProduct({
									...product,
									gallery: [...product.gallery, {
										url: "",
										kind: "image",
										alt: ""
									}]
								}),
								children: "Add gallery item"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionEditor, {
						title: "Shapes",
						hint: "G3DPG values: cube, sphere, cylinder, ring, gumdrop",
						options: product.shapes,
						onChange: (shapes) => setProduct({
							...product,
							shapes
						}),
						showG3d: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionEditor, {
						title: "Colors",
						options: product.colors,
						onChange: (colors) => setProduct({
							...product,
							colors
						}),
						showHex: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionEditor, {
						title: "Firmness",
						hint: "Thickness and periods map into G3DPG.",
						options: product.firmnessOptions,
						onChange: (firmnessOptions) => setProduct({
							...product,
							firmnessOptions
						}),
						kind: "firmness"
					}),
					product.textureEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionEditor, {
						title: "Texture",
						options: product.textureOptions,
						onChange: (textureOptions) => setProduct({
							...product,
							textureOptions
						}),
						kind: "texture"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void save(),
						children: busy ? "Saving…" : "Save product"
					})
				]
			})
		]
	});
}
//#endregion
export { ProductEditor as component };
