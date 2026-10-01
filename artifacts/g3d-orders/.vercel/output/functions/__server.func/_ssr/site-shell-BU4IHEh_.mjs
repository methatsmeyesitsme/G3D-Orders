import { o as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ShoppingBag } from "../_libs/lucide-react.mjs";
import { b as verifyAdminCode } from "./router-ECGtCFA4.mjs";
import { t as Button } from "./button-BPlrkmR0.mjs";
import { n as useAdminAccess, t as createSelectorStore } from "./admin-access-store-Y6OO6fCX.mjs";
import { t as Wordmark } from "./logo-pxdglL9K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-shell-BU4IHEh_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CART_STORAGE_KEY = "g3d-cart-v1";
var hasHydrated = false;
var cartStore = createSelectorStore({
	items: [],
	add: (item) => cartStore.setState((state) => {
		if (!state.items.find((entry) => entry.key === item.key)) return { items: [...state.items, item] };
		return { items: state.items.map((entry) => entry.key === item.key ? {
			...entry,
			selection: {
				...entry.selection,
				quantity: entry.selection.quantity + item.selection.quantity
			}
		} : entry) };
	}),
	remove: (key) => cartStore.setState((state) => ({ items: state.items.filter((item) => item.key !== key) })),
	setQty: (key, quantity) => cartStore.setState((state) => ({ items: quantity < 1 ? state.items.filter((item) => item.key !== key) : state.items.map((item) => item.key === key ? {
		...item,
		selection: {
			...item.selection,
			quantity
		}
	} : item) })),
	clear: () => cartStore.setState({ items: [] })
});
function useCart(selector) {
	const selected = cartStore.useStore(selector);
	(0, import_react.useEffect)(() => {
		if (hasHydrated || typeof window === "undefined") return;
		hasHydrated = true;
		try {
			const stored = window.localStorage.getItem(CART_STORAGE_KEY);
			const parsed = stored ? JSON.parse(stored) : null;
			if (Array.isArray(parsed?.items)) cartStore.setState({ items: parsed.items });
		} catch {
			window.localStorage.removeItem(CART_STORAGE_KEY);
		}
	}, []);
	return selected;
}
cartStore.subscribe(() => {
	if (!hasHydrated || typeof window === "undefined") return;
	window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: cartStore.getState().items }));
});
function cartCount(items) {
	return items.reduce((sum, item) => sum + item.selection.quantity, 0);
}
function cartTotal(items) {
	return items.reduce((sum, item) => sum + item.unitPriceCents * item.selection.quantity, 0);
}
function AdminLink({ className }) {
	const navigate = useNavigate();
	const unlock = useAdminAccess((s) => s.unlock);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [value, setValue] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	function close() {
		setOpen(false);
		setValue("");
		setError("");
	}
	(0, import_react.useEffect)(() => {
		if (!open) return;
		inputRef.current?.focus();
		const onKey = (e) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);
	async function submit() {
		if (busy || value.length < 10) return;
		setBusy(true);
		setError("");
		try {
			await verifyAdminCode({ data: { code: value } });
			unlock(value);
			close();
			await navigate({ to: "/admin" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "That passcode is not valid.");
			setValue("");
			inputRef.current?.focus();
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className,
		onClick: () => setOpen(true),
		children: "Admin"
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-foreground/40 px-6",
		onMouseDown: (e) => {
			if (e.target === e.currentTarget) close();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Admin passcode",
			className: "w-full max-w-sm rounded-xl bg-card p-6 text-center shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground",
					children: "Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl font-semibold",
					children: "Enter passcode"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "password",
					inputMode: "numeric",
					autoComplete: "off",
					"aria-label": "Passcode",
					value,
					onChange: (e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 10)),
					onKeyDown: (e) => {
						if (e.key === "Enter") submit();
					},
					className: "mt-6 flex h-11 w-full rounded-md border border-input bg-card px-3 text-center text-base tracking-[0.4em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 min-h-5 text-sm text-destructive",
					role: "alert",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "flex-1",
						onClick: close,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "flex-1",
						disabled: busy || value.length < 10,
						onClick: () => void submit(),
						children: busy ? "Checking…" : "Open"
					})]
				})
			]
		})
	}) : null] });
}
function SiteShell({ children }) {
	const count = cartCount(useCart((s) => s.items));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "min-h-11 items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "inline-flex h-11 items-center px-3 text-sm text-muted-foreground hover:text-foreground",
							children: "Store"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							className: "relative inline-flex h-11 items-center gap-2 px-3 text-sm text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Cart"
								}),
								count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-1 top-1.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground",
									children: count
								}) : null
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "G3D · printed lattice, made to order." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLink, { className: "inline-flex h-11 items-center text-foreground/70 hover:text-foreground" })]
				})
			})
		]
	});
}
//#endregion
export { cartTotal as n, useCart as r, SiteShell as t };
