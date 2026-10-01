import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { StatusBadge } from "@/components/status-badge";
import { getOrderByNumber } from "@/lib/store.functions";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/order/$orderNumber")({
  component: OrderPage,
});

function OrderPage() {
  const { orderNumber } = Route.useParams();
  const [state, setState] = useState<{
    loading: boolean;
    order: Awaited<ReturnType<typeof getOrderByNumber>>;
  }>({ loading: true, order: null });

  useEffect(() => {
    let live = true;
    void getOrderByNumber({ data: { orderNumber } }).then(
      (order) => {
        if (!live) return;
        setState({ loading: false, order });
      },
    );
    return () => {
      live = false;
    };
  }, [orderNumber]);

  if (state.loading) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-lg px-4 py-16 text-muted-foreground">
          Loading order…
        </div>
      </SiteShell>
    );
  }
  if (!state.order) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-lg px-4 py-16">
          <h1 className="font-display text-3xl font-semibold">Not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm underline">
            Back to store
          </Link>
        </div>
      </SiteShell>
    );
  }
  const order = state.order;
  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
          Order received
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          {order.orderNumber}
        </h1>
        <div className="mt-3">
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-4 text-muted-foreground">
          Filed for {order.customerName}. It is on the G3D desk.
        </p>
        <ul className="mt-8 space-y-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl bg-card p-4 text-sm shadow-[var(--shadow-border)]"
            >
              <p className="font-medium">
                {item.quantity} × {item.productName}
              </p>
              <p className="text-muted-foreground">
                {item.shape} · {item.color} · {item.firmness} · {item.texture}
              </p>
              <p className="tabular-nums">
                {formatMoney(item.unitPriceCents * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-right font-display text-2xl tabular-nums">
          {formatMoney(order.totalCents)}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center text-sm underline"
        >
          Continue in the store
        </Link>
      </div>
    </SiteShell>
  );
}
