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
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/product/$id")({
  component: ProductEditor,
});

function ProductEditor() {
  const { id } = Route.useParams();
  const adminCode = useAdminAccess((s) => s.code);
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void listCatalog({ data: { adminCode } }).then((catalog) => {
      setProduct(catalog.products.find((item) => item.id === id) ?? null);
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

  async function save() {
    const current = product;
    if (!current) return;
    setBusy(true);
    try {
      await upsertProduct({
        data: {
          adminCode: adminCode,
          id: current.id,
          lineId: current.lineId,
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

        <section className="space-y-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display font-semibold">Gallery</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setProduct({
                  ...product,
                  gallery: [
                    ...product.gallery,
                    { url: "", kind: "image", alt: "" },
                  ],
                })
              }
            >
              Add gallery item
            </Button>
          </div>
          {product.gallery.map((item, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-border/70 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <select
                  className="h-11 rounded-md border border-input bg-background px-2 text-sm"
                  value={item.kind}
                  onChange={(e) => {
                    const kind = e.target.value as "image" | "gif" | "video";
                    const gallery = product.gallery.map((g, i) =>
                      i === index ? { ...g, kind } : g,
                    );
                    setProduct({ ...product, gallery });
                  }}
                >
                  <option value="image">Image</option>
                  <option value="gif">GIF</option>
                  <option value="video">Video</option>
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setProduct({
                      ...product,
                      gallery: product.gallery.filter((_, i) => i !== index),
                    })
                  }
                >
                  Remove
                </Button>
              </div>
              <FileUrlField
                label={`Gallery item ${index + 1}`}
                value={item.url}
                accept={
                  item.kind === "video"
                    ? "video/*"
                    : item.kind === "gif"
                      ? "image/gif"
                      : "image/*"
                }
                onChange={(url) => {
                  const gallery = product.gallery.map((g, i) =>
                    i === index ? { ...g, url } : g,
                  );
                  setProduct({ ...product, gallery });
                }}
              />
            </div>
          ))}
          {product.gallery.length === 0 ? (
            <p className="text-sm text-muted-foreground">No gallery items yet.</p>
          ) : null}
        </section>

        <OptionEditor
          title="Shapes"
          hint="G3DPG values: cube, sphere, cylinder, ring, gumdrop"
          options={product.shapes}
          onChange={(shapes) => setProduct({ ...product, shapes })}
          showG3d
        />
        <OptionEditor
          title="Colors"
          options={product.colors}
          onChange={(colors) => setProduct({ ...product, colors })}
          showHex
        />
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
