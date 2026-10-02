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
  upsertLine,
} from "@/lib/store.functions";
import type { Product, ProductLine } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/admin/catalog")({
  component: CatalogPage,
});

function CatalogPage() {
  const adminCode = useAdminAccess((s) => s.code);
  const router = useRouter();
  const [lines, setLines] = useState<ProductLine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newLine, setNewLine] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductLineId, setNewProductLineId] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: "line" | "product";
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function refresh() {
    const catalog = await listCatalog({ data: { adminCode } });
    setLines(catalog.lines);
    setProducts(catalog.products);
    setNewProductLineId((prev) => {
      if (prev === "") return prev;
      if (prev && catalog.lines.some((l) => l.id === prev)) return prev;
      return "";
    });
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminCode]);

  async function addLine() {
    if (!newLine.trim()) return;
    try {
      const created = await upsertLine({
        data: {
          adminCode: adminCode,
          name: newLine.trim(),
          slug: newLine.trim(),
          tagline: "",
          description: "",
          coverImageUrl: "",
          coverGifUrl: "",
          sortOrder: lines.length,
        },
      });
      setNewLine("");
      toast.success("Line created");
      await refresh();
      void router.navigate({
        to: "/admin/line/$id",
        params: { id: created.id },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create line");
    }
  }

  async function addProduct() {
    const name = newProductName.trim();
    if (!name) {
      toast.error("Enter a product name");
      return;
    }
    // Empty lineId = standalone product (no line)
    const lineId = newProductLineId;
    setAddingProduct(true);
    try {
      const created = await createProductFromTemplate({
        data: { adminCode, lineId, name },
      });
      setNewProductName("");
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Catalog</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Add products to an existing line, or create a new line if you need one.
      </p>

      <section className="mt-6 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-lg font-semibold">Add product</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick an existing line, or choose None for a standalone product.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="new-product-name">Product name</Label>
            <Input
              id="new-product-name"
              placeholder="e.g. Gumdrop Soft"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void addProduct();
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-product-line">Product line</Label>
            <select
              id="new-product-line"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={newProductLineId}
              onChange={(e) => setNewProductLineId(e.target.value)}
            >
              <option value="">None (standalone)</option>
              {lines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={() => void addProduct()}
            disabled={addingProduct || !newProductName.trim()}
          >
            {addingProduct ? "Adding…" : "Add product"}
          </Button>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="New product line name (optional)"
          value={newLine}
          onChange={(e) => setNewLine(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void addLine();
          }}
        />
        <Button variant="outline" onClick={() => void addLine()}>
          Create line
        </Button>
      </div>

      <div className="mt-8 space-y-8">
        {lines.map((line) => {
          const lineProducts = products.filter((p) => p.lineId === line.id);
          return (
            <section
              key={line.id}
              className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    {line.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">/{line.slug}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/line/$id" params={{ id: line.id }}>
                      Edit line
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const name = window.prompt("Product name?");
                      if (!name) return;
                      const created = await createProductFromTemplate({
                        data: { adminCode, lineId: line.id, name },
                      });
                      await refresh();
                      void router.navigate({
                        to: "/admin/product/$id",
                        params: { id: created.id },
                      });
                    }}
                  >
                    Add product
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteTarget({
                        kind: "line",
                        id: line.id,
                        name: line.name,
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {lineProducts.map((product) => (
                  <li
                    key={product.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatMoney(product.basePriceCents)}
                        {product.active ? "" : " · hidden"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to="/admin/product/$id"
                          params={{ id: product.id }}
                        >
                          Edit
                        </Link>
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
                {lineProducts.length === 0 ? (
                  <li className="py-4 text-sm text-muted-foreground">
                    No products in this line yet.
                  </li>
                ) : null}
              </ul>
            </section>
          );
        })}
        {(() => {
          const standalone = products.filter((p) => !p.lineId);
          if (standalone.length === 0) return null;
          return (
            <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Standalone products
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Not assigned to any product line
                  </p>
                </div>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {standalone.map((product) => (
                  <li
                    key={product.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatMoney(product.basePriceCents)}
                        {product.active ? "" : " · hidden"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to="/admin/product/$id"
                          params={{ id: product.id }}
                        >
                          Edit
                        </Link>
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
          );
        })()}
        {lines.length === 0 && products.filter((p) => !p.lineId).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No products yet. Use <strong>Add product</strong> above — choose
            None for a standalone product, or create a line first.
          </p>
        ) : null}
      </div>
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.kind === "line"
                ? "This permanently removes the product line and all products in it from this store."
                : "This permanently removes the product from this store."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
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
