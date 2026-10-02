import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { ProductGallery } from "@/components/product-gallery";
import { Customizer } from "@/components/customizer";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/store.functions";
import { useCart } from "@/lib/cart-store";
import {
  buildG3dpgConfig,
  defaultSelection,
  findChoice,
  unitPriceCents,
} from "@/lib/pricing";

export const Route = createFileRoute("/line/$slug/p/$productSlug")({
  loader: async ({ params }) => {
    const product = await getProductBySlug({
      data: { lineSlug: params.slug, productSlug: params.productSlug },
    });
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const add = useCart((s) => s.add);
  const navigate = useNavigate();
  const [selection, setSelection] = useState(() => defaultSelection(product));
  const price = useMemo(
    () => unitPriceCents(product, selection),
    [product, selection],
  );

  function addToCart() {
    const name = selection.personalization.trim();
    if (!name) {
      toast.error("Enter your name for this piece.");
      return;
    }
    const shape = findChoice(product.shapes, selection.shape);
    const color = findChoice(product.colors, selection.color);
    const firmness = findChoice(product.firmnessOptions, selection.firmness);
    const texture = product.textureEnabled
      ? findChoice(product.textureOptions, selection.texture)
      : undefined;
    const g3dpg = buildG3dpgConfig(product, selection);
    const key = [
      product.id,
      selection.shape,
      selection.color,
      selection.firmness,
      selection.texture,
      name.toLowerCase(),
    ].join("|");
    add({
      key,
      productId: product.id,
      productSlug: product.slug,
      lineSlug: product.lineSlug ?? "",
      productName: product.name,
      lineName: product.lineName ?? "",
      imageUrl: product.imageUrl,
      selection,
      labels: {
        shape: shape?.label ?? selection.shape,
        color: color?.label ?? selection.color,
        firmness: firmness?.label ?? selection.firmness,
        texture: texture?.label ?? selection.texture ?? "",
      },
      unitPriceCents: price,
      g3dpg,
    });
    toast.success(`${product.name} added to cart`);
    void navigate({ to: "/cart" });
  }

  return (
    <SiteShell>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
        <ProductGallery product={product} selection={selection} />
        <div>
          <Link
            to="/line/$slug"
            params={{ slug: product.lineSlug ?? "" }}
            className="text-xs font-medium uppercase tracking-[0.18em] text-accent"
          >
            {product.lineName}
          </Link>
          <h1 className="mt-2 font-display text-4xl font-semibold">{product.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          <div className="mt-8">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Build your order
            </p>
            <Customizer
              product={product}
              selection={selection}
              onChange={setSelection}
            />
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={addToCart}>
            Add to cart
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Your cart stays on this device. Placed orders go to the shop admin from any device.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
