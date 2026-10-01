import { createSelectorStore } from "@/lib/selector-store";

const ADMIN_STORAGE_KEY = "g3d_orders_admin_unlock";

type AdminAccessState = {
  hydrated: boolean;
  unlocked: boolean;
  code: string;
  hydrate: () => void;
  unlock: (code: string) => void;
  lock: () => void;
};

const adminStore = createSelectorStore<AdminAccessState>({
  hydrated: false,
  unlocked: false,
  code: "",
  hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY) ?? "";
    adminStore.setState({ hydrated: true, unlocked: Boolean(stored), code: stored });
  },
  unlock: (code) => {
    sessionStorage.setItem(ADMIN_STORAGE_KEY, code);
    adminStore.setState({ hydrated: true, unlocked: true, code });
  },
  lock: () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    adminStore.setState({ hydrated: true, unlocked: false, code: "" });
  },
});

export function useAdminAccess<Selected>(
  selector: (state: AdminAccessState) => Selected,
) {
  return adminStore.useStore(selector);
}
