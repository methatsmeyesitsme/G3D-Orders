import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartTotal, useCart } from "@/lib/cart-store";
import { placeOrder } from "@/lib/store.functions";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function optionLabel(
  labels: { shape: string; color: string; firmness: string; texture: string } | undefined,
  selection: { shape: string; color: string; firmness: string; texture: string },
  key: "shape" | "color" | "firmness" | "texture",
) {
  return labels?.[key] || selection[key] || "—";
}

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    orderNumber: string;
    totalCents: number;
  } | null>(null);
  const total = cartTotal(items);

  // Prefill order name from the name already entered on product pages
  // (cart hydrates from localStorage after first render, so we sync here)
  useEffect(() => {
    if (nameTouched) return;
    const fromCart = items
      .map((item) => item.selection.personalization?.trim())
      .find((value) => value);
    if (fromCart) setName(fromCart);
  }, [items, nameTouched]);

  async function checkout() {
    const orderName =
      name.trim() ||
      items.map((item) => item.selection.personalization?.trim()).find((v) => v) ||
      "";
    if (!orderName) {
      toast.error("Enter the name for this order.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setBusy(true);
    try {
      const result = await placeOrder({
        data: {
          customerName: orderName,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            lineName: item.lineName,
            shape: optionLabel(item.labels, item.selection, "shape"),
            color: optionLabel(item.labels, item.selection, "color"),
            firmness: optionLabel(item.labels, item.selection, "firmness"),
            texture: optionLabel(item.labels, item.selection, "texture"),
            quantity: item.selection.quantity,
            unitPriceCents: item.unitPriceCents,
            personalization: item.selection.personalization || orderName,
            g3dpg: item.g3dpg,
          })),
        },
      });
      clear();
      setConfirmation({
        orderNumber: result.orderNumber,
        totalCents: result.totalCents,
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
        <p className="mt-2 text-sm text-muted-foreground">
          Saved on this device only. When you place an order it is sent to the shop admin.
        </p>
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
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="size-20 rounded-md object-cover"
                  />
                ) : (
                  <div className="grid size-20 place-items-center rounded-md bg-paper text-xs text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {optionLabel(item.labels, item.selection, "shape")} ·{" "}
                    {optionLabel(item.labels, item.selection, "color")} ·{" "}
                    {optionLabel(item.labels, item.selection, "firmness")}
                    {item.selection.texture
                      ? ` · ${optionLabel(item.labels, item.selection, "texture")}`
                      : ""}
                  </p>
                  {item.selection.personalization ? (
                    <p className="text-sm text-muted-foreground">
                      For {item.selection.personalization}
                    </p>
                  ) : null}
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
                onChange={(e) => {
                  setNameTouched(true);
                  setName(e.target.value);
                }}
                placeholder="Your name"
              />
              <p className="text-xs text-muted-foreground">
                Filled from the name you entered on the product page. You can change it if needed.
              </p>
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
      <Dialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order received</DialogTitle>
            <DialogDescription>
              Your order is saved on the server and will show in the admin panel.
              Keep this order number for reference.
            </DialogDescription>
          </DialogHeader>
          {confirmation ? (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order number</p>
              <p className="mt-1 font-display text-xl font-semibold">
                {confirmation.orderNumber}
              </p>
              <p className="mt-3 text-sm">
                Total: {formatMoney(confirmation.totalCents)}
              </p>
            </div>
          ) : null}
          <DialogFooter>
            {confirmation ? (
              <Button
                variant="outline"
                onClick={() =>
                  void navigate({
                    to: "/order/$orderNumber",
                    params: { orderNumber: confirmation.orderNumber },
                  })
                }
              >
                View order
              </Button>
            ) : null}
            <Button onClick={() => setConfirmation(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
