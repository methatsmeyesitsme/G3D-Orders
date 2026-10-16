import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useAdminAccess } from "@/lib/admin-access-store";
import { undoLatestCatalogChange } from "@/lib/store.functions";

const LINKS: {
  to:
    | "/admin"
    | "/admin/orders"
    | "/admin/receipts"
    | "/admin/catalog"
    | "/admin/preview";
  label: string;
  exact?: boolean;
}[] = [
  { to: "/admin", label: "Desk", exact: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/receipts", label: "Receipts" },
  { to: "/admin/catalog", label: "Catalog" },
  { to: "/admin/preview", label: "Preview" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const adminCode = useAdminAccess((s) => s.code);
  const [undoing, setUndoing] = useState(false);

  async function undoLatest() {
    const undoCode = window.prompt("Enter the undo password:");
    if (!undoCode) return;
    if (!window.confirm("Undo the latest product catalog change? This restores product and category details only. Customer orders will not be changed.")) return;
    setUndoing(true);
    try {
      const result = await undoLatestCatalogChange({ data: { adminCode, undoCode } });
      toast.success("Latest catalog change undone", { description: result.message });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not undo the latest change");
    } finally {
      setUndoing(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link to="/admin">
            <Wordmark subtitle="Admin" />
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={link.exact ? { exact: true } : undefined}
                className={cn(
                  "inline-flex h-11 items-center rounded-md px-3 text-sm text-muted-foreground",
                )}
                activeProps={{
                  className:
                    "inline-flex h-11 items-center rounded-md bg-secondary px-3 text-sm text-foreground",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/"
              className="inline-flex h-11 items-center px-3 text-sm text-muted-foreground"
            >
              Store
            </Link>
            <Button size="sm" variant="destructive" disabled={undoing} onClick={() => void undoLatest()}>
              {undoing ? "Undoing…" : "Undo latest change"}
            </Button>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
