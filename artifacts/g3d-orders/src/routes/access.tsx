import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { unlockStore } from "@/lib/store.functions";

export const Route = createFileRoute("/access")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : "/",
  }),
  component: StoreAccessPage,
});

function StoreAccessPage() {
  const { next } = Route.useSearch();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const result = await unlockStore({ data: { code } });
      if (!result.ok) {
        setError(
          result.reason === "not-configured"
            ? "Store access is not configured yet."
            : "That code is not correct.",
        );
        return;
      }

      const destination =
        next.startsWith("/") && !next.startsWith("//") && next !== "/access"
          ? next
          : "/";
      window.location.replace(destination);
    } catch {
      setError("Could not verify the code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 py-10 text-foreground">
      <section className="w-full max-w-sm rounded-2xl bg-card p-7 shadow-[var(--shadow-border)] sm:p-9">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
          G3D Orders
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold">
          Store access
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the access code to continue.
        </p>
        <form className="mt-7 space-y-4" onSubmit={(event) => void submit(event)}>
          <div className="space-y-2">
            <Label htmlFor="store-access-code">Access code</Label>
            <Input
              id="store-access-code"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
              autoFocus
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button className="w-full" type="submit" disabled={busy}>
            {busy ? "Checking…" : "Enter store"}
          </Button>
        </form>
      </section>
    </main>
  );
}