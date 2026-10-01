import { useSyncExternalStore } from "react";

type Listener = () => void;

/**
 * A tiny selector store for the storefront's two local UI stores.
 * Keeps the existing selector-based API without depending on an uninstalled
 * external state package in this imported Vite artifact.
 */
export function createSelectorStore<State>(initialState: State) {
  let state = initialState;
  const listeners = new Set<Listener>();

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setState(
    update: Partial<State> | ((current: State) => Partial<State>),
  ) {
    const patch = typeof update === "function" ? update(state) : update;
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  }

  function getState() {
    return state;
  }

  function useStore<Selected>(selector: (current: State) => Selected) {
    return useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(state),
    );
  }

  return { getState, setState, subscribe, useStore };
}