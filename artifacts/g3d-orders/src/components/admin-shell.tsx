import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/logo";
import { cn } from "@/lib/utils";

const LINKS: {
  to: "/admin" | "/admin/orders" | "/admin/catalog" | "/admin/preview";
  label: string;
  exact?: boolean;
}[] = [
  { to: "/admin", label: "Desk", exact: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/catalog", label: "Catalog" },
  { to: "/admin/preview", label: "Preview" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link to="/admin">
            <Wordmark subtitle="Admin" />
          </Link>
          <nav className="flex flex-wrap gap-1">
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
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
