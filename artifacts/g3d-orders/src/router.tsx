import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    basepath: import.meta.env.VITE_GITHUB_PAGES === "true" ? "/G3D-Orders" : "/",
    defaultPreload: "intent",
    defaultErrorComponent: AppErrorComponent,
  });
}
