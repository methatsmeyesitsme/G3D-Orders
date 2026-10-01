import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { useAdminAccess } from "@/lib/admin-access-store";
import { openG3dpg } from "@/lib/g3dpg";
import { listOrders, updateOrderStatus } from "@/lib/store.functions";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const adminCode = useAdminAccess((s) => s.code);
  const [orders, setOrders] = useState<Order[]>([]);

  const refresh = useCallback(() => {
    return listOrders({ data: { adminCode } }).then(setOrders);
  }, [adminCode]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function setStatus(orderId: string, status: OrderStatus) {
    await updateOrderStatus({ data: { adminCode, orderId, status } });
    await refresh();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Orders</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        GO sends shape, color, firmness, texture, name, and size into G3DPG.
      </p>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl font-semibold">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.customerName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <p className="tabular-nums">{formatMoney(order.totalCents)}</p>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs text-muted-foreground">
                Status
                <select
                  className="ml-2 h-10 rounded-md border border-input bg-background px-2 text-sm"
                  value={order.status}
                  onChange={(e) =>
                    void setStatus(order.id, e.target.value as OrderStatus)
                  }
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
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
          </article>
        ))}
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
