import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "muted" | "accent" | "ok" | "warn";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        tone === "muted" && "bg-secondary text-muted-foreground",
        tone === "accent" && "bg-accent/12 text-accent",
        tone === "ok" && "bg-emerald-700/10 text-emerald-800",
        tone === "warn" && "bg-amber-700/10 text-amber-800",
        className,
      )}
      {...props}
    />
  );
}
