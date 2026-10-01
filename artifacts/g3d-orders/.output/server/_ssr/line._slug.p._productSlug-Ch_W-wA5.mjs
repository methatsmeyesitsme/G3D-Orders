import { o as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, r as formatMoney } from "./store.functions-DgdVEH25.mjs";
import { a as Plus, o as Minus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route } from "./router-DKuHnLMn.mjs";
import { t as Button } from "./button-BPlrkmR0.mjs";
import { t as Input } from "./input-C_9SzDEd.mjs";
import { t as Label } from "./label-Dvc2icdl.mjs";
import { r as useCart, t as SiteShell } from "./site-shell-C5cMkjzu.mjs";
import { t as MediaFrame } from "./media-frame-VKPcZ4AB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/line._slug.p._productSlug-Ch_W-wA5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function findChoice(list, id) {
	return list.find((item) => item.id === id) ?? list[0];
}
function unitPriceCents(product, selection) {
	let total = product.basePriceCents;
	const add = (list, id) => {
		const choice = list.find((item) => item.id === id);
		if (choice) total += choice.priceDelta;
	};
	add(product.shapes, selection.shape);
	add(product.colors, selection.color);
	add(product.firmnessOptions, selection.firmness);
	if (product.textureEnabled) add(product.textureOptions, selection.texture);
	return total;
}
function defaultSelection(product) {
	return {
		shape: product.shapes[0]?.id ?? "",
		color: product.colors[0]?.id ?? "",
		firmness: product.firmnessOptions[0]?.id ?? "",
		texture: product.textureEnabled ? product.textureOptions[0]?.id ?? "" : "",
		quantity: 1,
		personalization: ""
	};
}
function metaNum(choice, key, fallback) {
	const raw = choice?.meta?.[key];
	return typeof raw === "number" ? raw : fallback;
}
function metaBool(choice, key, fallback) {
	const raw = choice?.meta?.[key];
	return typeof raw === "boolean" ? raw : fallback;
}
function buildG3dpgConfig(product, selection) {
	const shape = findChoice(product.shapes, selection.shape);
	const color = findChoice(product.colors, selection.color);
	const firmness = findChoice(product.firmnessOptions, selection.firmness);
	const texture = product.textureEnabled ? findChoice(product.textureOptions, selection.texture) : void 0;
	const g3dShape = shape?.g3dpgValue || shape?.id || "cube";
	const size = String(product.sizeMm);
	const extra = product.extraSettings ?? {};
	const thickness = extra.thicknessOverride ?? metaNum(firmness, "thickness", 1.5);
	const periods = extra.periodsOverride ?? metaNum(firmness, "periods", 2.5);
	const textureOn = product.textureEnabled && metaBool(texture, "toggle", false);
	const amount = textureOn ? metaNum(texture, "amount", 50) : 0;
	const name = selection.personalization.trim() || `${product.name.replace(/\s+/g, "")}-${g3dShape}`;
	const cfg = {
		shape: g3dShape,
		pattern: product.infillPattern || "gyroid",
		quality: String(extra.quality ?? "192"),
		periods: String(periods),
		thickness: String(thickness),
		textureToggle: textureOn,
		textureAmount: amount,
		customName: name,
		color: color?.id,
		firmness: firmness?.id,
		texture: texture?.id,
		quantity: selection.quantity,
		productName: product.name
	};
	if (g3dShape === "cube") cfg.size = size;
	if (g3dShape === "sphere") cfg.diameter = size;
	if (g3dShape === "cylinder") {
		cfg.diameter = size;
		cfg.height = size;
	}
	if (g3dShape === "gumdrop") {
		cfg.diameter = size;
		cfg.height = String(Math.round(product.sizeMm * 1.1));
	}
	if (g3dShape === "ring") {
		cfg.outerDiameter = String(Math.round(product.sizeMm * 1.2));
		cfg.tubeDiameter = String(Math.round(product.sizeMm * .32));
	}
	if (typeof extra.walls === "boolean") cfg.wallsToggle = extra.walls;
	if (typeof extra.wallThickness === "number") cfg.wallThickness = String(extra.wallThickness);
	if (typeof extra.rounded === "boolean") cfg.rounded = extra.rounded;
	if (typeof extra.cornerRadius === "number") cfg.cornerRadius = String(extra.cornerRadius);
	return cfg;
}
var SHAPE_IMAGES = {
	gumdrop: "/products/gumdrop.jpg",
	cube: "/products/cube.jpg",
	sphere: "/products/sphere.jpg",
	cylinder: "/products/cylinder.jpg",
	ring: "/products/ring.jpg"
};
function SquishPreview({ product, selection, className }) {
	const shape = findChoice(product.shapes, selection.shape);
	const color = findChoice(product.colors, selection.color);
	const firmness = findChoice(product.firmnessOptions, selection.firmness);
	const hex = color?.hex ?? "#f4f1ea";
	const photo = color?.imageUrl || SHAPE_IMAGES[shape?.g3dpgValue || shape?.id || ""] || product.imageUrl;
	const squish = 1 - Math.max(0, product.firmnessOptions.findIndex((item) => item.id === firmness?.id)) * .035;
	const grain = product.textureEnabled && selection.texture && selection.texture !== "none" ? selection.texture === "heavy" ? .42 : selection.texture === "moderate" ? .28 : .16 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-lg bg-paper", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-square overflow-hidden",
			style: {
				transform: `scaleY(${squish})`,
				transformOrigin: "bottom"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: photo,
					alt: `${product.name} ${shape?.label ?? ""}`,
					className: "h-full w-full object-cover"
				}),
				color?.id && color.id !== "white" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 mix-blend-multiply",
					style: {
						background: hex,
						opacity: color.id === "black" ? .55 : .38
					}
				}) : null,
				grain > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 mix-blend-overlay",
					style: {
						opacity: grain,
						backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='80' height='80' filter='url(%23n)' opacity='0.55'/></svg>\")"
					}
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium text-foreground",
			children: [
				color?.label,
				" · ",
				shape?.label
			]
		})]
	});
}
function ProductGallery({ product, selection }) {
	const items = (0, import_react.useMemo)(() => {
		const list = [{
			id: "live",
			url: "__live__",
			kind: "image",
			alt: "Live preview"
		}];
		const extras = [
			...product.gallery,
			product.gifUrl ? {
				url: product.gifUrl,
				kind: "gif",
				alt: "Motion"
			} : null,
			product.videoUrl ? {
				url: product.videoUrl,
				kind: "video",
				alt: "Video"
			} : null
		].filter((item) => Boolean(item && item.url));
		const seen = /* @__PURE__ */ new Set();
		extras.forEach((item, index) => {
			if (seen.has(item.url)) return;
			seen.add(item.url);
			list.push({
				...item,
				id: `m${index}`
			});
		});
		return list;
	}, [product]);
	const [active, setActive] = (0, import_react.useState)(items[0]?.id ?? "live");
	const current = items.find((item) => item.id === active) ?? items[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]",
			children: current?.id === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquishPreview, {
				product,
				selection
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-square",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
					src: current.url,
					kind: current.kind,
					alt: current.alt || product.name
				})
			})
		}), items.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2 overflow-x-auto pb-1",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setActive(item.id),
				className: cn("relative size-16 shrink-0 overflow-hidden rounded-md border border-border", active === item.id && "ring-2 ring-ring ring-offset-2 ring-offset-background"),
				"aria-label": item.alt || "Media",
				children: item.id === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquishPreview, {
					product,
					selection
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
					src: item.url,
					kind: item.kind,
					alt: ""
				})
			}, item.id))
		}) : null]
	});
}
function OptionGrid({ label, options, value, onChange, swatches }) {
	if (!options.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex flex-wrap gap-2", swatches && "gap-3"),
				children: options.map((option) => {
					const selected = option.id === value;
					if (swatches) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onChange(option.id),
						className: cn("relative size-11 rounded-full border border-border", selected && "ring-2 ring-ring ring-offset-2 ring-offset-background"),
						style: { background: option.hex ?? "var(--muted)" },
						"aria-pressed": selected,
						"aria-label": option.label,
						title: option.label
					}, option.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onChange(option.id),
						className: cn("min-h-11 rounded-md border px-3 text-sm", selected ? "border-foreground bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary"),
						"aria-pressed": selected,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: option.label }), option.priceDelta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-xs opacity-70",
							children: [option.priceDelta > 0 ? "+" : "", formatMoney(option.priceDelta)]
						}) : null]
					}, option.id);
				})
			}),
			swatches ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: options.find((o) => o.id === value)?.label
			}) : null
		]
	});
}
function Customizer({ product, selection, onChange }) {
	const price = unitPriceCents(product, selection);
	const patch = (partial) => onChange({
		...selection,
		...partial
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionGrid, {
				label: "Shape",
				options: product.shapes,
				value: selection.shape,
				onChange: (shape) => patch({ shape })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionGrid, {
				label: "Color",
				options: product.colors,
				value: selection.color,
				onChange: (color) => patch({ color }),
				swatches: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionGrid, {
				label: "Firmness",
				options: product.firmnessOptions,
				value: selection.firmness,
				onChange: (firmness) => patch({ firmness })
			}),
			product.textureEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionGrid, {
				label: "Surface texture",
				options: product.textureOptions,
				value: selection.texture,
				onChange: (texture) => patch({ texture })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "qty",
						children: "Quantity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "icon",
								"aria-label": "Decrease quantity",
								onClick: () => patch({ quantity: Math.max(1, selection.quantity - 1) }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "qty",
								className: "text-center tabular-nums",
								type: "number",
								min: 1,
								max: 99,
								value: selection.quantity,
								onChange: (e) => patch({ quantity: Math.max(1, Math.min(99, Number(e.target.value) || 1)) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "icon",
								"aria-label": "Increase quantity",
								onClick: () => patch({ quantity: Math.min(99, selection.quantity + 1) }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Name on this piece"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						maxLength: 40,
						placeholder: "Your name",
						value: selection.personalization,
						onChange: (e) => patch({ personalization: e.target.value })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end justify-between border-t border-border pt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.16em] text-muted-foreground",
						children: "Price"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-semibold tabular-nums",
						children: formatMoney(price * selection.quantity)
					}),
					selection.quantity > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground tabular-nums",
						children: [formatMoney(price), " each"]
					}) : null
				] })
			})
		]
	});
}
function ProductPage() {
	const { product } = Route.useLoaderData();
	const add = useCart((s) => s.add);
	const navigate = useNavigate();
	const [selection, setSelection] = (0, import_react.useState)(() => defaultSelection(product));
	const price = (0, import_react.useMemo)(() => unitPriceCents(product, selection), [product, selection]);
	function addToCart() {
		const name = selection.personalization.trim();
		if (!name) {
			toast.error("Add a name so this piece can be filed.");
			return;
		}
		const g3dpg = buildG3dpgConfig(product, selection);
		const shape = findChoice(product.shapes, selection.shape);
		const color = findChoice(product.colors, selection.color);
		const key = [
			product.id,
			selection.shape,
			selection.color,
			selection.firmness,
			selection.texture,
			name.toLowerCase()
		].join("|");
		add({
			key,
			productId: product.id,
			productSlug: product.slug,
			lineSlug: product.lineSlug ?? "",
			productName: product.name,
			lineName: product.lineName ?? "",
			imageUrl: color?.imageUrl || product.imageUrl,
			selection,
			unitPriceCents: price,
			g3dpg
		});
		toast.success(`${product.name} · ${shape?.label} added`);
		navigate({ to: "/cart" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid w-full max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGallery, {
			product,
			selection
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/line/$slug",
				params: { slug: product.lineSlug ?? "" },
				className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
				children: product.lineName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold",
				children: product.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted-foreground",
				children: product.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Customizer, {
					product,
					selection,
					onChange: setSelection
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6 w-full",
				size: "lg",
				onClick: addToCart,
				children: "Add to cart"
			})
		] })]
	}) });
}
//#endregion
export { ProductPage as component };
