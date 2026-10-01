const UPSTREAM = "https://methatsmeyesitsme.github.io/Better-Bins";

const INJECT = `
<script id="g3d-order-inject">
(function () {
  var params = new URLSearchParams(location.search);
  if (!params.get("g3d") && !params.get("shape")) return;
  function setValue(id, value) {
    if (value == null || value === "") return;
    var el = document.getElementById(id);
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = value === "1" || value === "true";
    } else {
      el.value = value;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function applyRest() {
    setValue("p_size", params.get("size"));
    setValue("p_diameter", params.get("diameter"));
    setValue("p_height", params.get("height"));
    setValue("p_outerDiameter", params.get("outerDiameter"));
    setValue("p_tubeDiameter", params.get("tubeDiameter"));
    setValue("pattern", params.get("pattern"));
    setValue("quality", params.get("quality"));
    setValue("periods", params.get("periods"));
    setValue("thickness", params.get("thickness"));
    setValue("textureToggle", params.get("textureToggle"));
    setValue("textureAmount", params.get("textureAmount"));
    setValue("wallsToggle", params.get("wallsToggle"));
    setValue("wallThickness", params.get("wallThickness"));
    setValue("rounded", params.get("rounded"));
    setValue("cornerRadius", params.get("cornerRadius"));
    setValue("customName", params.get("customName"));
    var tab = document.getElementById("tabPG");
    if (tab) tab.click();
  }
  function apply() {
    setValue("shape", params.get("shape"));
    setTimeout(applyRest, 80);
    setTimeout(applyRest, 280);
    setTimeout(applyRest, 700);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
</script>`;

function contentTypeFor(path: string, fallback: string) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (lower.endsWith(".css")) return "text/css; charset=utf-8";
  if (lower.endsWith(".html")) return "text/html; charset=utf-8";
  if (lower.endsWith(".wasm")) return "application/wasm";
  if (lower.endsWith(".json")) return "application/json";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".woff2")) return "font/woff2";
  return fallback;
}

export async function proxyG3dpg(splat: string | undefined, request: Request) {
  const path = (splat ?? "").replace(/^\/+/, "");
  const isIndex = !path || path === "index.html";
  const incoming = new URL(request.url);
  const target = isIndex
    ? `${UPSTREAM}/${incoming.search}`
    : `${UPSTREAM}/${path}${incoming.search}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      headers: {
        "User-Agent": request.headers.get("user-agent") ?? "G3D-Orders",
        Accept: request.headers.get("accept") ?? "*/*",
      },
      redirect: "follow",
    });
  } catch {
    if (!isIndex) return new Response("G3DPG asset unavailable", { status: 502 });
    return fallbackPage(incoming.search);
  }

  if (!upstream.ok && isIndex) return fallbackPage(incoming.search);

  const type = contentTypeFor(
    path || "index.html",
    upstream.headers.get("content-type") ?? "application/octet-stream",
  );

  if (isIndex) {
    let html = await upstream.text();
    if (!html.includes("<base ")) {
      html = html.replace("<head>", '<head>\n<base href="/g3dpg-app/">');
    }
    if (html.includes("</body>")) {
      html = html.replace("</body>", `${INJECT}\n</body>`);
    } else {
      html += INJECT;
    }
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=300",
    },
  });
}

function fallbackPage(search: string) {
  const direct = `https://methatsmeyesitsme.github.io/Better-Bins/${search}`;
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Open G3DPG</title>
<meta http-equiv="refresh" content="0;url=${direct}">
<style>body{font-family:system-ui;background:#17130f;color:#f1ede6;padding:48px;}</style>
</head><body>
<p>Opening G3DPG with this order…</p>
<p><a href="${direct}" style="color:#e07a3f">Continue to G3DPG</a></p>
</body></html>`;
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
