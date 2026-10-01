import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-Doa1GMob.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatMoney(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
}
function newId(prefix) {
	return `${prefix}_${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "").slice(0, 12) : Math.random().toString(36).slice(2, 14)}`;
}
//#endregion
export { formatMoney as n, newId as r, cn as t };
