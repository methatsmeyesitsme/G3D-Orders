import { o as __toESM } from "../_runtime.mjs";
import { y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-access-store-Y6OO6fCX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* A tiny selector store for the storefront's two local UI stores.
* Keeps the existing selector-based API without depending on an uninstalled
* external state package in this imported Vite artifact.
*/
function createSelectorStore(initialState) {
	let state = initialState;
	const listeners = /* @__PURE__ */ new Set();
	function subscribe(listener) {
		listeners.add(listener);
		return () => listeners.delete(listener);
	}
	function setState(update) {
		const patch = typeof update === "function" ? update(state) : update;
		state = {
			...state,
			...patch
		};
		listeners.forEach((listener) => listener());
	}
	function getState() {
		return state;
	}
	function useStore(selector) {
		return (0, import_react.useSyncExternalStore)(subscribe, () => selector(state), () => selector(state));
	}
	return {
		getState,
		setState,
		subscribe,
		useStore
	};
}
var ADMIN_STORAGE_KEY = "g3d_orders_admin_unlock";
var adminStore = createSelectorStore({
	hydrated: false,
	unlocked: false,
	code: "",
	hydrate: () => {
		if (typeof window === "undefined") return;
		const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY) ?? "";
		adminStore.setState({
			hydrated: true,
			unlocked: Boolean(stored),
			code: stored
		});
	},
	unlock: (code) => {
		sessionStorage.setItem(ADMIN_STORAGE_KEY, code);
		adminStore.setState({
			hydrated: true,
			unlocked: true,
			code
		});
	},
	lock: () => {
		sessionStorage.removeItem(ADMIN_STORAGE_KEY);
		adminStore.setState({
			hydrated: true,
			unlocked: false,
			code: ""
		});
	}
});
function useAdminAccess(selector) {
	return adminStore.useStore(selector);
}
//#endregion
export { useAdminAccess as n, createSelectorStore as t };
