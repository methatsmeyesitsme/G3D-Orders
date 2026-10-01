import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { verifyAdminCode } from "@/lib/store.functions";
import { useAdminAccess } from "@/lib/admin-access-store";
import { Button } from "@/components/ui/button";

export function AdminLink({ className }: { className?: string }) {
  const navigate = useNavigate();
  const unlock = useAdminAccess((s) => s.unlock);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function close() {
    setOpen(false);
    setValue("");
    setError("");
  }

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit() {
    if (busy || value.length < 10) return;
    setBusy(true);
    setError("");
    try {
      await verifyAdminCode({ data: { code: value } });
      unlock(value);
      close();
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "That passcode is not valid.");
      setValue("");
      inputRef.current?.focus();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Admin
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 px-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Admin passcode"
            className="w-full max-w-sm rounded-xl bg-card p-6 text-center shadow-[var(--shadow-border)]"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Admin
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Enter passcode</h2>
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              aria-label="Passcode"
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submit();
              }}
              className="mt-6 flex h-11 w-full rounded-md border border-input bg-card px-3 text-center text-base tracking-[0.4em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="mt-3 min-h-5 text-sm text-destructive" role="alert">
              {error}
            </p>
            <div className="mt-4 flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={close}>
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={busy || value.length < 10}
                onClick={() => void submit()}
              >
                {busy ? "Checking…" : "Open"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
