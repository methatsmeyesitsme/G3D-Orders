import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card text-card-foreground shadow-[var(--shadow-border)]",
        className,
      )}
      {...props}
    />
  );
}
