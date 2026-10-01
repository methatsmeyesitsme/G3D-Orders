import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartTotal, useCart } from "@/lib/cart-store";
import { placeOrder } from "@/lib/store.functions";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const [name, setName] = useState(
    () => items[0]?.selection.personalization ?? "",
  );
  const [busy, setBusy] = useState(false);
  const total = cartTotal(items);

  async function checkout() {
    if (!name.trim()) {
      toast.error("Enter the name for this order.");
      return;
    }
    setBusy(true);
    try {
      const result = await placeOrder({
        data: {
          customerName: name.trim(),
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            lineName: item.lineName,
            shape: item.selection.shape,
            color: item.selection.color,
            firmness: item.selection.firmness,
            texture: item.selection.texture,
            quantity: item.selection.quantity,
            unitPriceCents: item.unitPriceCents,
            personalization: item.selection.personalization,
            g3dpg: item.g3dpg,
          })),
        },
      });
      clear();
      toast.success(`Order ${result.orderNumber} is in.`);
      void navigate({
        to: "/order/$orderNumber",
        params: { orderNumber: result.orderNumber },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-4xl font-semibold">Cart</h1>
        {items.length === 0 ? (
          <p className="mt-6 text-muted-foreground">
            Empty.{" "}
            <Link to="/" className="text-foreground underline">
              Browse the store
            </Link>
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex gap-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
              >
                <img
                  src={item.imageUrl}
                  alt=""
                  className="size-20 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.selection.shape} · {item.selection.color} ·{" "}
                    {item.selection.firmness}
                    {item.selection.texture ? ` · ${item.selection.texture}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For {item.selection.personalization}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <Input
                      className="h-10 w-20"
                      type="number"
                      min={1}
                      value={item.selection.quantity}
                      onChange={(e) =>
                        setQty(item.key, Number(e.target.value) || 1)
                      }
                    />
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => remove(item.key)}
                    >
                      Remove
                    </button>
                    <p className="ml-auto tabular-nums">
                      {formatMoney(item.unitPriceCents * item.selection.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="order-name">Name on the order</Label>
              <Input
                id="order-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-5">
              <p className="text-muted-foreground">Total</p>
              <p className="font-display text-2xl font-semibold tabular-nums">
                {formatMoney(total)}
              </p>
            </div>
            <Button className="w-full" size="lg" disabled={busy} onClick={() => void checkout()}>
              {busy ? "Placing…" : "Place order"}
            </Button>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
