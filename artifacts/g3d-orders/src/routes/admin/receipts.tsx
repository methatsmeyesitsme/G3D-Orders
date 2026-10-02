import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAdminAccess } from "@/lib/admin-access-store";
import { openG3dpg } from "@/lib/g3dpg";
import { deleteOrder, listOrders } from "@/lib/store.functions";
import type { Order } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/admin/receipts")({
  component: ReceiptsPage,
});

function formatWhen(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function ReceiptsPage() {
  const adminCode = useAdminAccess((s) => s.code);
  const [orders, setOrders] = useState<Order[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const refresh = useCallback(() => {
    return listOrders({ data: { adminCode } }).then(setOrders);
  }, [adminCode]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const receipts = useMemo(
    () =>
      orders
        .filter((o) => o.status === "completed")
        .sort((a, b) =>
          String(b.completedAt || b.createdAt).localeCompare(
            String(a.completedAt || a.createdAt),
          ),
        ),
    [orders],
  );

  async function removeOrder(order: Order) {
    if (
      !window.confirm(
        `Delete receipt for ${order.customerName} (${order.orderNumber})? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusyId(order.id);
    try {
      await deleteOrder({ data: { adminCode, orderId: order.id } });
      await refresh();
      toast.success(`Deleted ${order.orderNumber}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete receipt");
    } finally {
      setBusyId(null);
    }
  }

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Receipts</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every completed order. Open a row for full details. Delete removes it
        permanently.
      </p>

      <div className="mt-6 space-y-2">
        {receipts.map((order) => {
          const isOpen = Boolean(open[order.id]);
          const busy = busyId === order.id;
          return (
            <div
              key={order.id}
              className="rounded-xl bg-card shadow-[var(--shadow-border)]"
            >
              <div className="flex w-full items-center gap-2 px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => toggle(order.id)}
                  className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{order.customerName}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground sm:mt-0 sm:ml-3 sm:inline">
                      Completed {formatWhen(order.completedAt)}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden tabular-nums text-sm text-muted-foreground sm:inline">
                      {formatMoney(order.totalCents)}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </div>
                </button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy}
                  onClick={(e) => {
                    e.stopPropagation();
                    void removeOrder(order);
                  }}
                >
                  Delete
                </Button>
              </div>
              {isOpen ? (
                <div className="border-t border-border px-4 pb-4 pt-3 sm:px-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-semibold">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Completed {formatWhen(order.completedAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Placed {formatWhen(order.createdAt)}
                      </p>
                      {order.notes ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Notes: {order.notes}
                        </p>
                      ) : null}
                    </div>
                    <p className="tabular-nums font-medium">
                      {formatMoney(order.totalCents)}
                    </p>
                  </div>
                  <OrderItemsTable order={order} />
                </div>
              ) : null}
            </div>
          );
        })}
        {receipts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No receipts yet. Mark an order as completed on the Orders tab to
            move it here.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function OrderItemsTable({ order }: { order: Order }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="py-2 font-medium">Product</th>
            <th className="py-2 font-medium">Shape</th>
            <th className="py-2 font-medium">Color</th>
            <th className="py-2 font-medium">Firmness</th>
            <th className="py-2 font-medium">Texture</th>
            <th className="py-2 font-medium">Qty</th>
            <th className="py-2 font-medium">Price</th>
            <th className="py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-t border-border">
              <td className="py-3">
                <p>{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.personalization}
                </p>
              </td>
              <td className="py-3">{item.shape}</td>
              <td className="py-3">{item.color}</td>
              <td className="py-3">{item.firmness}</td>
              <td className="py-3">{item.texture || "—"}</td>
              <td className="py-3 tabular-nums">{item.quantity}</td>
              <td className="py-3 tabular-nums">
                {formatMoney(item.unitPriceCents * item.quantity)}
              </td>
              <td className="py-3 text-right">
                <Button
                  size="sm"
                  variant="accent"
                  onClick={() =>
                    openG3dpg({
                      ...item.g3dpg,
                      orderNumber: order.orderNumber,
                      customName:
                        item.personalization || item.g3dpg.customName,
                    })
                  }
                >
                  GO
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
