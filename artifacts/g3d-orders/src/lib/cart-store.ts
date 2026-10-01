import { useEffect } from "react";
import { createSelectorStore } from "@/lib/selector-store";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  setQty: (key: string, quantity: number) => void;
  clear: () => void;
};

const CART_STORAGE_KEY = "g3d-cart-v1";
let hasHydrated = false;
const cartStore = createSelectorStore<CartState>({
  items: [],
  add: (item) =>
    cartStore.setState((state) => {
      const existing = state.items.find((entry) => entry.key === item.key);
      if (!existing) return { items: [...state.items, item] };
      return {
        items: state.items.map((entry) =>
          entry.key === item.key
            ? {
                ...entry,
                selection: {
                  ...entry.selection,
                  quantity: entry.selection.quantity + item.selection.quantity,
                },
              }
            : entry,
        ),
      };
    }),
  remove: (key) =>
    cartStore.setState((state) => ({
      items: state.items.filter((item) => item.key !== key),
    })),
  setQty: (key, quantity) =>
    cartStore.setState((state) => ({
      items:
        quantity < 1
          ? state.items.filter((item) => item.key !== key)
          : state.items.map((item) =>
              item.key === key
                ? { ...item, selection: { ...item.selection, quantity } }
                : item,
            ),
    })),
  clear: () => cartStore.setState({ items: [] }),
});

export function useCart<Selected>(selector: (state: CartState) => Selected) {
  const selected = cartStore.useStore(selector);
  useEffect(() => {
    if (hasHydrated || typeof window === "undefined") return;
    hasHydrated = true;
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as { items?: CartItem[] }) : null;
      if (Array.isArray(parsed?.items)) {
        cartStore.setState({ items: parsed.items });
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);
  return selected;
}

cartStore.subscribe(() => {
  if (!hasHydrated || typeof window === "undefined") return;
  window.localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify({ items: cartStore.getState().items }),
  );
});

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.selection.quantity, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.selection.quantity,
    0,
  );
}
