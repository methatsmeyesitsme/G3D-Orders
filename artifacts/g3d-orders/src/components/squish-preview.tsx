import { cn } from "@/lib/utils";
import type { Product, Selection } from "@/lib/types";
import { findChoice } from "@/lib/pricing";

const SHAPE_IMAGES: Record<string, string> = {
  gumdrop: "/products/gumdrop.jpg",
  cube: "/products/cube.jpg",
  sphere: "/products/sphere.jpg",
  cylinder: "/products/cylinder.jpg",
  ring: "/products/ring.jpg",
};

export function SquishPreview({
  product,
  selection,
  className,
}: {
  product: Product;
  selection: Selection;
  className?: string;
}) {
  const shape = findChoice(product.shapes, selection.shape);
  const color = findChoice(product.colors, selection.color);
  const firmness = findChoice(product.firmnessOptions, selection.firmness);
  const hex = color?.hex ?? "#f4f1ea";
  const photo =
    color?.imageUrl ||
    SHAPE_IMAGES[shape?.g3dpgValue || shape?.id || ""] ||
    product.imageUrl;
  const firmIndex = Math.max(
    0,
    product.firmnessOptions.findIndex((item) => item.id === firmness?.id),
  );
  const squish = 1 - firmIndex * 0.035;
  const grain =
    product.textureEnabled && selection.texture && selection.texture !== "none"
      ? selection.texture === "heavy"
        ? 0.42
        : selection.texture === "moderate"
          ? 0.28
          : 0.16
      : 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-paper",
        className,
      )}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ transform: `scaleY(${squish})`, transformOrigin: "bottom" }}
      >
        <img
          src={photo}
          alt={`${product.name} ${shape?.label ?? ""}`}
          className="h-full w-full object-cover"
        />
        {color?.id && color.id !== "white" ? (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{ background: hex, opacity: color.id === "black" ? 0.55 : 0.38 }}
          />
        ) : null}
        {grain > 0 ? (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{
              opacity: grain,
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='80' height='80' filter='url(%23n)' opacity='0.55'/></svg>\")",
            }}
          />
        ) : null}
      </div>
      <div className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium text-foreground">
        {color?.label} · {shape?.label}
      </div>
    </div>
  );
}
