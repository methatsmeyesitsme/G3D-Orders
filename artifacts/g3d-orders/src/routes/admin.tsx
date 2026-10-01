import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin-shell";
import { useAdminAccess } from "@/lib/admin-access-store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const hydrated = useAdminAccess((s) => s.hydrated);
  const unlocked = useAdminAccess((s) => s.unlocked);
  const hydrate = useAdminAccess((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && !unlocked) void navigate({ to: "/", replace: true });
  }, [hydrated, unlocked, navigate]);

  if (!hydrated || !unlocked) return null;

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
