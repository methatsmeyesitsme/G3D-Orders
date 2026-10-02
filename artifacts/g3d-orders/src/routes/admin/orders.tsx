import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { useAdminAccess } from "@/lib/admin-access-store";
import { openG3dpg } from "@/lib/g3dpg";
import { deleteOrder, listOrders, updateOrderStatus } from "@/lib/store.functions";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
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

function OrdersPage() {
  const adminCode = useAdminAccess((s) => s.code);
  const [orders, setOrders] = useState<Order[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    return listOrders({ data: { adminCode } }).then(setOrders);
  }, [adminCode]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== "completed"),
    [orders],
  );
  const receiptCount = useMemo(
    () => orders.filter((o) => o.status === "completed").length,
    [orders],
  );

  async function setStatus(orderId: string, status: OrderStatus) {
    setBusyId(orderId);
    try {
      await updateOrderStatus({ data: { adminCode, orderId, status } });
      await refresh();
      if (status === "completed") {
        toast.success("Moved to Receipts");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update status");
    } finally {
      setBusyId(null);
    }
  }

  async function removeOrder(order: Order) {
    if (
      !window.confirm(
        `Delete order ${order.orderNumber}? This cannot be undone.`,
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
      toast.error(e instanceof Error ? e.message : "Could not delete order");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Orders</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Latest active orders. Use{" "}
            <span className="font-medium text-foreground">To Receipts</span> to
            archive a finished job.
          </p>
        </div>
        <Link
          to="/admin/receipts"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Receipts ({receiptCount})
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {activeOrders.map((order) => (
          <ActiveOrderCard
            key={order.id}
            order={order}
            busy={busyId === order.id}
            onStatus={(status) => void setStatus(order.id, status)}
            onDelete={() => void removeOrder(order)}
          />
        ))}
        {activeOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active orders.</p>
        ) : null}
      </div>
    </div>
  );
}

function ActiveOrderCard({
  order,
  busy,
  onStatus,
  onDelete,
}: {
  order: Order;
  busy: boolean;
  onStatus: (status: OrderStatus) => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl font-semibold">{order.orderNumber}</p>
          <p className="text-sm text-muted-foreground">{order.customerName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Placed {formatWhen(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <p className="tabular-nums">{formatMoney(order.totalCents)}</p>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => onStatus("completed")}
          >
            To Receipts
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={busy}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <label className="text-xs text-muted-foreground">
          Status
          <select
            className="ml-2 h-10 rounded-md border border-input bg-background px-2 text-sm"
            value={order.status}
            onChange={(e) => onStatus(e.target.value as OrderStatus)}
          >
            {ORDER_STATUSES.filter((s) => s.id !== "completed").map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
            <option value="completed">Completed (Receipts)</option>
          </select>
        </label>
      </div>
      <OrderItemsTable order={order} />
    </article>
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
