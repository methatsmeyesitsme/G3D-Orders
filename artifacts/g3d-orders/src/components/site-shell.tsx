import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/logo";
import { cartCount, useCart } from "@/lib/cart-store";
import { AdminLink } from "@/components/admin-link";

export function SiteShell({ children }: { children: ReactNode }) {
  const items = useCart((s) => s.items);
  const count = cartCount(items);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="min-h-11 items-center">
            <Wordmark />
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className="inline-flex h-11 items-center px-3 text-sm text-muted-foreground hover:text-foreground"
            >
              Store
            </Link>
            <Link
              to="/cart"
              className="relative inline-flex h-11 items-center gap-2 px-3 text-sm text-foreground"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 ? (
                <span className="absolute right-1 top-1.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>G3D · printed lattice, made to order.</p>
          <AdminLink className="inline-flex h-11 items-center text-foreground/70 hover:text-foreground" />
        </div>
      </footer>
    </div>
  );
}
