import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-accent", className)}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M16 3.2 28 10v12L16 28.8 4 22V10L16 3.2Zm0 3.1L7.2 11.2v9.6L16 25.7l8.8-4.9v-9.6L16 6.3Zm0 3.4 5.6 3.1v1.8L16 17.8l-5.6-3.2v-1.8L16 9.7Zm-4.4 6.4 4.4 2.5v5.1l-4.4-2.5v-5.1Zm8.8 0v5.1l-4.4 2.5v-5.1l4.4-2.5Z"
      />
    </svg>
  );
}

export function Wordmark({
  subtitle = "Orders",
  className,
}: {
  subtitle?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <Mark className="size-6 self-center" />
      <span className="font-display text-lg font-semibold tracking-tight">
        G3D
      </span>
      {subtitle ? (
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {subtitle}
        </span>
      ) : null}
    </span>
  );
}
