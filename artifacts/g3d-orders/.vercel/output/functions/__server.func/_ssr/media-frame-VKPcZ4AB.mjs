import { t as cn } from "./utils-Doa1GMob.mjs";
import { h as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media-frame-VKPcZ4AB.js
var import_jsx_runtime = require_jsx_runtime();
function MediaFrame({ src, kind, alt, className }) {
	if (!src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid aspect-square place-items-center bg-paper text-sm text-muted-foreground", className),
		children: "No media"
	});
	if (kind === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(src)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		className: cn("h-full w-full object-cover", className),
		src,
		autoPlay: true,
		muted: true,
		loop: true,
		playsInline: true,
		"aria-label": alt
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		className: cn("h-full w-full object-cover", className)
	});
}
//#endregion
export { MediaFrame as t };
