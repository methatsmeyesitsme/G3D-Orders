import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/types";

const TONE: Record<OrderStatus, "muted" | "accent" | "ok" | "warn"> = {
  new: "accent",
  making: "warn",
  ready: "ok",
  completed: "muted",
  cancelled: "muted",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge tone={TONE[status]} className="capitalize">
      {status}
    </Badge>
  );
}
