import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileUrlField } from "@/components/file-url-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OptionEditor } from "@/components/option-editor";
import { useAdminAccess } from "@/lib/admin-access-store";
import { listCatalog, upsertProduct } from "@/lib/store.functions";
import type { ColorPart, Product, ProductLine, SliderMode } from "@/lib/types";
import { resolveSliderMode } from "@/lib/types";

export const Route = createFileRoute("/admin/product/$id")({
  component: ProductEditor,
});

function newPartId() {
  return `part_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function ProductEditor() {
  const { id } = Route.useParams();
  const adminCode = useAdminAccess((s) => s.code);
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [lines, setLines] = useState<ProductLine[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void listCatalog({ data: { adminCode } }).then((catalog) => {
      const found = catalog.products.find((item) => item.id === id) ?? null;
      if (found) {
        setProduct({
          ...found,
          colorParts: Array.isArray(found.colorParts) ? found.colorParts : [],
        });
      } else {
        setProduct(null);
      }
      setLines(catalog.lines);
    });
  }, [adminCode, id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">
        Loading product…
      </div>
    );
  }

  const extra = product.extraSettings ?? {};
  const colorParts = product.colorParts ?? [];

  function setColorParts(next: ColorPart[]) {
    setProduct({ ...product!, colorParts: next });
  }

  async function save() {
    const current = product;
    if (!current) return;
    setBusy(true);
    try {
      await upsertProduct({
        data: {
          adminCode: adminCode,
          id: current.id,
          lineId: current.lineId || "",
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
          colorParts: current.colorParts ?? [],
          firmnessOptions: current.firmnessOptions,
          textureEnabled: current.textureEnabled,
          textureOptions: current.textureOptions,
          infillPattern: current.infillPattern,
          sizeMm: current.sizeMm,
          extraSettings: current.extraSettings,
          active: current.active,
          sortOrder: current.sortOrder,
        },
      });
      toast.success("Product saved");
      void navigate({ to: "/admin/catalog" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/admin/catalog" className="text-sm text-muted-foreground">
        Catalog
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold">Edit product</h1>
      <div className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={product.slug}
              onChange={(e) => setProduct({ ...product, slug: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Product line</Label>
          <select
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={product.lineId || ""}
            onChange={(e) =>
              setProduct({ ...product, lineId: e.target.value })
            }
          >
            <option value="">None (standalone)</option>
            {lines.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            None means this product is not under a product line. Store URL:{" "}
            {product.lineId
              ? `/line/…/p/${product.slug}`
              : `/p/${product.slug}`}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Base price (cents)</Label>
            <Input
              type="number"
              value={product.basePriceCents}
              onChange={(e) =>
                setProduct({
                  ...product,
                  basePriceCents: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Size (mm)</Label>
            <Input
              type="number"
              value={product.sizeMm}
              onChange={(e) =>
                setProduct({ ...product, sizeMm: Number(e.target.value) || 50 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Infill pattern</Label>
            <Input
              value={product.infillPattern}
              onChange={(e) =>
                setProduct({ ...product, infillPattern: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Mesh quality</Label>
            <Input
              value={String(extra.quality ?? "192")}
              onChange={(e) =>
                setProduct({
                  ...product,
                  extraSettings: { ...extra, quality: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Sort</Label>
            <Input
              type="number"
              value={product.sortOrder}
              onChange={(e) =>
                setProduct({
                  ...product,
                  sortOrder: Number(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Slider</Label>
          <select
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={resolveSliderMode(extra)}
            onChange={(e) => {
              const mode = e.target.value as SliderMode;
              setProduct({
                ...product,
                extraSettings: {
                  ...extra,
                  sliderMode: mode,
                  // Keep legacy boolean in sync when not "none"
                  sliderClicks:
                    mode === "none" ? undefined : mode === "click",
                },
              });
            }}
          >
            <option value="click">Click</option>
            <option value="no-click">No click</option>
            <option value="none">None</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Slider design: discrete clicks, smooth with no clicks, or none (no slider treatment).
          </p>
        </div>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={product.active}
            onChange={(e) =>
              setProduct({ ...product, active: e.target.checked })
            }
          />
          Visible in the store
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={product.textureEnabled}
            onChange={(e) =>
              setProduct({ ...product, textureEnabled: e.target.checked })
            }
          />
          Texture is available
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(extra.rounded)}
            onChange={(e) =>
              setProduct({
                ...product,
                extraSettings: { ...extra, rounded: e.target.checked },
              })
            }
          />
          Rounded edges in G3DPG
        </label>

        <FileUrlField
          label="Main picture"
          value={product.imageUrl}
          accept="image/*"
          onChange={(imageUrl) => setProduct({ ...product, imageUrl })}
        />
        <FileUrlField
          label="GIF"
          value={product.gifUrl}
          accept="image/gif"
          onChange={(gifUrl) => setProduct({ ...product, gifUrl })}
        />
        <FileUrlField
          label="Video"
          value={product.videoUrl}
          accept="video/*"
          onChange={(videoUrl) => setProduct({ ...product, videoUrl })}
        />

        <OptionEditor
          title="Shapes"
          hint="G3DPG values: cube, sphere, cylinder, ring, gumdrop"
          options={product.shapes}
          onChange={(shapes) => setProduct({ ...product, shapes })}
          showG3d
        />
        <OptionEditor
          title="Colors"
          hint="Shared color palette for this product."
          options={product.colors}
          onChange={(colors) => setProduct({ ...product, colors })}
          showHex
        />

        <section className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold">
                Color parts
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Leave empty for a single Color choice. Add parts so the customer
                picks a color for each region — e.g. "Rollers" and "Base".
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setColorParts([
                  ...colorParts,
                  {
                    id: newPartId(),
                    label: colorParts.length === 0 ? "Rollers" : "Base",
                  },
                ])
              }
            >
              Add part
            </Button>
          </div>
          {colorParts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Single color mode (default).
            </p>
          ) : (
            <div className="space-y-2">
              {colorParts.map((part, index) => (
                <div
                  key={part.id}
                  className="flex flex-wrap items-end gap-2 rounded-lg bg-secondary/60 p-3"
                >
                  <div className="min-w-[10rem] flex-1 space-y-1">
                    <Label>Part name</Label>
                    <Input
                      value={part.label}
                      placeholder="e.g. Rollers"
                      onChange={(e) => {
                        const next = colorParts.map((p, i) =>
                          i === index ? { ...p, label: e.target.value } : p,
                        );
                        setColorParts(next);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setColorParts(colorParts.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <OptionEditor
          title="Firmness"
          hint="Thickness and periods map into G3DPG."
          options={product.firmnessOptions}
          onChange={(firmnessOptions) =>
            setProduct({ ...product, firmnessOptions })
          }
          kind="firmness"
        />
        {product.textureEnabled ? (
          <OptionEditor
            title="Texture"
            options={product.textureOptions}
            onChange={(textureOptions) =>
              setProduct({ ...product, textureOptions })
            }
            kind="texture"
          />
        ) : null}

        <Button disabled={busy} onClick={() => void save()}>
          {busy ? "Saving…" : "Save product"}
        </Button>
      </div>
    </div>
  );
}
