import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAdminAccess } from "@/lib/admin-access-store";
import { listCatalog, listOrders } from "@/lib/store.functions";
import { formatMoney } from "@/lib/utils";
import type { Order, ProductLine } from "@/lib/types";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const adminCode = useAdminAccess((s) => s.code);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lines, setLines] = useState<ProductLine[]>([]);

  useEffect(() => {
    void listOrders({ data: { adminCode } }).then(setOrders);
    void listCatalog({ data: { adminCode } }).then((c) =>
      setLines(c.lines),
    );
  }, [adminCode]);

  const open = orders.filter((o) => o.status === "new" || o.status === "making");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Desk</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Orders land here. GO opens G3DPG with the exact spec.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Open tickets" value={String(open.length)} />
        <Stat label="All orders" value={String(orders.length)} />
        <Stat label="Product lines" value={String(lines.length)} />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/admin/orders"
          className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground"
        >
          Open orders
        </Link>
        <Link
          to="/admin/catalog"
          className="inline-flex h-11 items-center rounded-md border border-border bg-card px-4 text-sm"
        >
          Edit catalog
        </Link>
      </div>
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">Latest</h2>
        <ul className="mt-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {orders.slice(0, 6).map((order) => (
            <li key={order.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">{order.customerName}</p>
              </div>
              <p className="tabular-nums text-sm">{formatMoney(order.totalCents)}</p>
            </li>
          ))}
          {orders.length === 0 ? (
            <li className="px-4 py-8 text-sm text-muted-foreground">
              No orders yet.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}
