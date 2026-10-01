import { useMemo, useState } from "react";
import { MediaFrame } from "@/components/media-frame";
import { SquishPreview } from "@/components/squish-preview";
import { cn } from "@/lib/utils";
import type { GalleryItem, Product, Selection } from "@/lib/types";

export function ProductGallery({
  product,
  selection,
}: {
  product: Product;
  selection: Selection;
}) {
  const items = useMemo(() => {
    const list: Array<GalleryItem & { id: string }> = [
      { id: "live", url: "__live__", kind: "image", alt: "Live preview" },
    ];
    const extras = [
      ...product.gallery,
      product.gifUrl
        ? { url: product.gifUrl, kind: "gif" as const, alt: "Motion" }
        : null,
      product.videoUrl
        ? { url: product.videoUrl, kind: "video" as const, alt: "Video" }
        : null,
    ].filter((item): item is GalleryItem => Boolean(item && item.url));
    const seen = new Set<string>();
    extras.forEach((item, index) => {
      if (seen.has(item.url)) return;
      seen.add(item.url);
      list.push({ ...item, id: `m${index}` });
    });
    return list;
  }, [product]);

  const [active, setActive] = useState(items[0]?.id ?? "live");
  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]">
        {current?.id === "live" ? (
          <SquishPreview product={product} selection={selection} />
        ) : (
          <div className="aspect-square">
            <MediaFrame
              src={current.url}
              kind={current.kind}
              alt={current.alt || product.name}
            />
          </div>
        )}
      </div>
      {items.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border border-border",
                active === item.id && "ring-2 ring-ring ring-offset-2 ring-offset-background",
              )}
              aria-label={item.alt || "Media"}
            >
              {item.id === "live" ? (
                <SquishPreview product={product} selection={selection} />
              ) : (
                <MediaFrame src={item.url} kind={item.kind} alt="" />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
