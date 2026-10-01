import { createFileRoute } from "@tanstack/react-router";
import { proxyG3dpg } from "@/lib/g3dpg-proxy.server";

export const Route = createFileRoute("/g3dpg-app/")({
  server: {
    handlers: {
      GET: ({ request }) => proxyG3dpg("", request),
    },
  },
});
