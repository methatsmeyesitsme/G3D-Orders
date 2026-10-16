import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAccess } from "@/lib/admin-access-store";
import {
  createProductFromTemplate,
  deleteLine,
  deleteProduct,
  listCatalog,
  setProductActive,
  upsertLine,
} from "@/lib/store.functions";
import { getHomeLayout, saveHomeLayout } from "@/lib/home-layout.functions";
import { mergeHomeLayout } from "@/lib/home-layout";
import type { Product, ProductLine } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/admin/catalog")({
  component: CatalogAdmin,
});

function CatalogAdmin() {
  const adminCode = useAdminAccess((s) => s.code);
  const router = useRouter();
  const [lines, setLines] = useState<ProductLine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [lineName, setLineName] = useState("");
  const [productName, setProductName] = useState("");
  const [productLineId, setProductLineId] = useState("");
  const [addingLine, setAddingLine] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<
    | { kind: "line" | "product"; id: string; name: string }
    | null
  >(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  async function refresh() {
    const catalog = await listCatalog({ data: { adminCode } });
    setLines(catalog.lines.sort((a, b) => a.sortOrder - b.sortOrder));
    setProducts(catalog.products.sort((a, b) => a.sortOrder - b.sortOrder));
  }

  useEffect(() => {
    void refresh();
  }, [adminCode]);

  async function addLine() {
    if (!lineName.trim()) return;
    setAddingLine(true);
    try {
      const created = await upsertLine({
        data: {
          adminCode,
          name: lineName.trim(),
          slug: lineName.trim(),
          tagline: "",
          description: "",
          coverImageUrl: "",
          coverGifUrl: "",
          sortOrder: lines.length,
        },
      });
      setLineName("");
      toast.success("Product line created");
      await refresh();
      void router.navigate({
        to: "/admin/line/$id",
        params: { id: created.id },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create line");
    } finally {
      setAddingLine(false);
    }
  }

  async function addProduct() {
    if (!productName.trim()) return;
    setAddingProduct(true);
    try {
      const created = await createProductFromTemplate({
        data: {
          adminCode,
          lineId: productLineId,
          name: productName.trim(),
        },
      });
      setProductName("");
      toast.success("Product created");
      await refresh();
      void router.navigate({
        to: "/admin/product/$id",
        params: { id: created.id },
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not create product",
      );
    } finally {
      setAddingProduct(false);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    setToggling(id);
    try {
      await setProductActive({ data: { adminCode, id, active } });
      // When putting a product back on the store, also unhide its card on the
      // home/preview layout so it appears there without a manual reset.
      if (active && adminCode) {
        try {
          const layout = await getHomeLayout();
          const key = `product:${id}`;
          if (layout.hiddenElements?.includes(key)) {
            const next = mergeHomeLayout({
              ...layout,
              hiddenElements: layout.hiddenElements.filter((k) => k !== key),
            });
            await saveHomeLayout({ data: { adminCode, layout: next } });
          }
        } catch {
          // Layout update is best-effort; product is already active on the store.
        }
      }
      toast.success(active ? "Back on the store" : "Hidden from the store");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update");
    } finally {
      setToggling(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.kind === "line") {
        await deleteLine({ data: { adminCode, id: deleteTarget.id } });
      } else {
        await deleteProduct({ data: { adminCode, id: deleteTarget.id } });
      }
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete item");
    } finally {
      setDeleting(false);
    }
  }

  const activeProducts = products.filter((p) => p.active);
  const hiddenProducts = products.filter((p) => !p.active);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Catalog</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Hide a product to take it off the store temporarily. Show puts it back.
      </p>

      <section className="mt-8 space-y-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-lg font-semibold">Add product line</h2>
        <div className="flex flex-wrap gap-2">
          <Input
            className="max-w-xs"
            placeholder="Line name"
            value={lineName}
            onChange={(e) => setLineName(e.target.value)}
          />
          <Button disabled={addingLine || !lineName.trim()} onClick={() => void addLine()}>
            {addingLine ? "Adding…" : "Add line"}
          </Button>
        </div>
      </section>

      <section className="mt-6 space-y-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-lg font-semibold">Add product</h2>
        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              className="w-48"
              placeholder="Product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Line (optional)</Label>
            <select
              className="flex h-11 rounded-md border border-input bg-background px-3 text-sm"
              value={productLineId}
              onChange={(e) => setProductLineId(e.target.value)}
            >
              <option value="">Standalone</option>
              {lines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            disabled={addingProduct || !productName.trim()}
            onClick={() => void addProduct()}
          >
            {addingProduct ? "Adding…" : "Add product"}
          </Button>
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl font-semibold">Product lines</h2>
        {lines.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lines yet.</p>
        ) : (
          <ul className="space-y-2">
            {lines.map((line) => (
              <li
                key={line.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-medium">{line.name}</p>
                  <p className="text-xs text-muted-foreground">/{line.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin/line/$id" params={{ id: line.id }}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteTarget({ kind: "line", id: line.id, name: line.name })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl font-semibold">Products on the store</h2>
        {activeProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">None visible right now.</p>
        ) : (
          <ul className="space-y-2">
            {activeProducts.map((product) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMoney(product.basePriceCents)}
                    {product.lineId ? " · in a line" : " · standalone"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin/product/$id" params={{ id: product.id }}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={toggling === product.id}
                    onClick={() => void toggleActive(product.id, false)}
                  >
                    {toggling === product.id ? "…" : "Hide from store"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteTarget({
                        kind: "product",
                        id: product.id,
                        name: product.name,
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {hiddenProducts.length > 0 ? (
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-xl font-semibold">Off the store</h2>
          <p className="text-sm text-muted-foreground">
            Temporarily hidden. Use Show on store to put them back.
          </p>
          <ul className="space-y-2">
            {hiddenProducts.map((product) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMoney(product.basePriceCents)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin/product/$id" params={{ id: product.id }}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    disabled={toggling === product.id}
                    onClick={() => void toggleActive(product.id, true)}
                  >
                    {toggling === product.id ? "…" : "Show on store"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteTarget({
                        kind: "product",
                        id: product.id,
                        name: product.name,
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone from the admin UI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
