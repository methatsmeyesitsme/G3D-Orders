import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  async function refresh() {
    const catalog = await listCatalog({ data: { adminCode } });
    setLines(catalog.lines);
    setProducts(catalog.products);
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Catalog</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Add lines and products from here. No code edits.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="New product line name"
          value={newLine}
          onChange={(e) => setNewLine(e.target.value)}
        />
        <Button onClick={() => void addLine()}>Create line</Button>
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
                  <h2 className="font-display text-2xl font-semibold">{line.name}</h2>
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
                    onClick={async () => {
                      if (!window.confirm(`Remove ${line.name}?`)) return;
                      await deleteLine({ data: { adminCode, id: line.id } });
                      await refresh();
                    }}
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
                        <Link to="/admin/product/$id" params={{ id: product.id }}>
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          if (!window.confirm(`Remove ${product.name}?`)) return;
                          await deleteProduct({
                            data: { adminCode, id: product.id },
                          });
                          await refresh();
                        }}
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
      </div>
    </div>
  );
}
