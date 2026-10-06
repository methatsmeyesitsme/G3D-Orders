import type { G3dpgConfig, OptionChoice, Product, Selection } from "@/lib/types";

export function findChoice(list: OptionChoice[], id: string) {
  return list.find((item) => item.id === id) ?? list[0];
}

/** Human-readable color line for cart / orders (single or multi-part). */
export function formatColorLabel(product: Product, selection: Selection): string {
  const parts = product.colorParts ?? [];
  if (!parts.length) {
    return findChoice(product.colors, selection.color)?.label ?? selection.color ?? "";
  }
  return parts
    .map((part) => {
      const colorId =
        selection.partColors?.[part.id] || selection.color || product.colors[0]?.id || "";
      const choice = findChoice(product.colors, colorId);
      return `${part.label}: ${choice?.label ?? colorId}`;
    })
    .join(" · ");
}

export function unitPriceCents(product: Product, selection: Selection) {
  let total = product.basePriceCents;
  const add = (list: OptionChoice[], id: string) => {
    const choice = list.find((item) => item.id === id);
    if (choice) total += choice.priceDelta;
  };
  add(product.shapes, selection.shape);
  const parts = product.colorParts ?? [];
  if (parts.length) {
    for (const part of parts) {
      const colorId = selection.partColors?.[part.id] || selection.color;
      if (colorId) add(product.colors, colorId);
    }
  } else {
    add(product.colors, selection.color);
  }
  add(product.firmnessOptions, selection.firmness);
  if (product.textureEnabled) add(product.textureOptions, selection.texture);
  return total;
}

export function defaultSelection(product: Product): Selection {
  const defaultColor = product.colors[0]?.id ?? "";
  const parts = product.colorParts ?? [];
  const partColors: Record<string, string> = {};
  for (const part of parts) {
    partColors[part.id] = defaultColor;
  }
  return {
    shape: product.shapes[0]?.id ?? "",
    color: defaultColor,
    partColors,
    firmness: product.firmnessOptions[0]?.id ?? "",
    texture: product.textureEnabled
      ? (product.textureOptions[0]?.id ?? "")
      : "",
    quantity: 1,
    personalization: "",
  };
}

function metaNum(choice: OptionChoice | undefined, key: keyof NonNullable<OptionChoice["meta"]>, fallback: number) {
  const raw = choice?.meta?.[key];
  return typeof raw === "number" ? raw : fallback;
}

function metaBool(choice: OptionChoice | undefined, key: keyof NonNullable<OptionChoice["meta"]>, fallback: boolean) {
  const raw = choice?.meta?.[key];
  return typeof raw === "boolean" ? raw : fallback;
}

export function buildG3dpgConfig(
  product: Product,
  selection: Selection,
): G3dpgConfig {
  const shape = findChoice(product.shapes, selection.shape);
  const color = findChoice(product.colors, selection.color);
  const firmness = findChoice(product.firmnessOptions, selection.firmness);
  const texture = product.textureEnabled
    ? findChoice(product.textureOptions, selection.texture)
    : undefined;
  const g3dShape = shape?.g3dpgValue || shape?.id || "cube";
  const size = String(product.sizeMm);
  const extra = product.extraSettings ?? {};
  const thickness = extra.thicknessOverride ?? metaNum(firmness, "thickness", 1.5);
  const periods = extra.periodsOverride ?? metaNum(firmness, "periods", 2.5);
  const textureOn = product.textureEnabled && metaBool(texture, "toggle", false);
  const amount = textureOn ? metaNum(texture, "amount", 50) : 0;
  const name =
    selection.personalization.trim() ||
    `${product.name.replace(/\s+/g, "")}-${g3dShape}`;

  const cfg: G3dpgConfig = {
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
    productName: product.name,
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
    cfg.tubeDiameter = String(Math.round(product.sizeMm * 0.32));
  }

  if (typeof extra.walls === "boolean") cfg.wallsToggle = extra.walls;
  if (typeof extra.wallThickness === "number") {
    cfg.wallThickness = String(extra.wallThickness);
  }
  if (typeof extra.rounded === "boolean") cfg.rounded = extra.rounded;
  if (typeof extra.cornerRadius === "number") {
    cfg.cornerRadius = String(extra.cornerRadius);
  }

  return cfg;
}
