import type { G3dpgConfig } from "@/lib/types";

export const G3DPG_ORIGIN = "https://methatsmeyesitsme.github.io/Better-Bins/";

export function buildG3dpgSearch(cfg: G3dpgConfig) {
  const params = new URLSearchParams();
  params.set("g3d", "1");
  params.set("shape", cfg.shape);
  params.set("pattern", cfg.pattern);
  params.set("quality", cfg.quality);
  params.set("periods", cfg.periods);
  params.set("thickness", cfg.thickness);
  params.set("textureToggle", cfg.textureToggle ? "1" : "0");
  params.set("textureAmount", String(cfg.textureAmount));
  params.set("customName", cfg.customName);
  if (cfg.size) params.set("size", cfg.size);
  if (cfg.diameter) params.set("diameter", cfg.diameter);
  if (cfg.height) params.set("height", cfg.height);
  if (cfg.outerDiameter) params.set("outerDiameter", cfg.outerDiameter);
  if (cfg.tubeDiameter) params.set("tubeDiameter", cfg.tubeDiameter);
  if (cfg.wallsToggle != null) params.set("wallsToggle", cfg.wallsToggle ? "1" : "0");
  if (cfg.wallThickness) params.set("wallThickness", cfg.wallThickness);
  if (cfg.rounded != null) params.set("rounded", cfg.rounded ? "1" : "0");
  if (cfg.cornerRadius) params.set("cornerRadius", cfg.cornerRadius);
  if (cfg.color) params.set("color", cfg.color);
  if (cfg.firmness) params.set("firmness", cfg.firmness);
  if (cfg.texture) params.set("texture", cfg.texture);
  if (cfg.quantity) params.set("quantity", String(cfg.quantity));
  if (cfg.orderNumber) params.set("order", cfg.orderNumber);
  if (cfg.productName) params.set("product", cfg.productName);
  return params;
}

export function g3dpgStudioUrl(cfg: G3dpgConfig) {
  return `/g3dpg-app/?${buildG3dpgSearch(cfg).toString()}`;
}

export function g3dpgDirectUrl(cfg: G3dpgConfig) {
  return `${G3DPG_ORIGIN}?${buildG3dpgSearch(cfg).toString()}`;
}

/** Open G3DPG in a new tab only — never navigate away from the current page. */
export function openG3dpg(cfg: G3dpgConfig) {
  const studio = g3dpgDirectUrl(cfg);
  const opened = window.open(studio, "_blank", "noopener,noreferrer");
  if (opened) {
    opened.opener = null;
    return;
  }
  // Popup blocked: use a temporary <a target="_blank"> click (still new tab).
  const anchor = document.createElement("a");
  anchor.href = studio;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
