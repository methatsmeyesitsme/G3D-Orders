type Req = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
};

type Res = {
  status: (code: number) => Res;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
  json: (body: unknown) => void;
};

const API = "https://api.github.com";
const GH_OWNER = process.env.G3D_GITHUB_OWNER?.trim() || "methatsmeyesitsme";
const GH_REPO = process.env.G3D_GITHUB_REPO?.trim() || "G3D-Orders";
const GH_BRANCH = process.env.G3D_GITHUB_BRANCH?.trim() || "main";
const GH_TOKEN = process.env.G3D_GITHUB_TOKEN?.trim();
const ADMIN_CODE = process.env.G3D_ADMIN_PASSCODE?.trim() || "2004051315";
const ORDERS_PATH = "data/orders";

function send(res: Res, status: number, body: unknown) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.json(body);
}

function cors(res: Res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function requireEnv() {
  if (!GH_TOKEN) throw new Error("G3D GitHub storage is not configured on the backend.");
}

function assertAdmin(code: unknown) {
  if (typeof code !== "string" || code !== ADMIN_CODE) {
    throw new Error("That admin code is not valid.");
  }
}

function ghHeaders(): Record<string, string> {
  requireEnv();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "G3D-Orders",
    Authorization: `Bearer ${GH_TOKEN}`,
  };
}

async function ghJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(API + `/repos/${GH_OWNER}/${GH_REPO}${path}`, {
    ...init,
    headers: {
      ...ghHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub storage error ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as T;
}

function decode(content: string) {
  return Buffer.from(content.replace(/\s/g, ""), "base64").toString("utf8");
}

function encode(content: string) {
  return Buffer.from(content, "utf8").toString("base64");
}

async function getFile(path: string) {
  return ghJson<{ content: string; sha: string }>(
    `/contents/${path}?ref=${encodeURIComponent(GH_BRANCH)}`,
  );
}

async function writeFile(path: string, content: string, message: string, sha?: string) {
  const body: Record<string, unknown> = {
    message,
    content: encode(content),
    branch: GH_BRANCH,
  };
  if (sha) body.sha = sha;

  await ghJson(`/contents/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function listOrderPaths() {
  const rows = await ghJson<Array<{ type: string; name: string; path: string }>>(
    `/contents/${ORDERS_PATH}?ref=${encodeURIComponent(GH_BRANCH)}`,
  );
  return rows
    .filter((row) => row.type === "file" && row.name.endsWith(".json"))
    .map((row) => row.path);
}

async function readOrder(path: string) {
  const file = await getFile(path);
  return JSON.parse(decode(file.content)) as any;
}

function newOrderNumber(existing: Set<string>) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 100; attempt += 1) {
    let suffix = "";
    for (let i = 0; i < 6; i += 1) {
      suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const number = `G3D-${suffix}`;
    if (!existing.has(number)) return number;
  }
  return `G3D-${Date.now().toString(36).toUpperCase()}`;
}

async function placeOrder(data: any) {
  if (!data || typeof data.customerName !== "string" || !Array.isArray(data.items) || data.items.length < 1) {
    throw new Error("Invalid order.");
  }

  const existingOrders = (await listOrderPaths()).reduce(async (promise, path) => {
    const used = await promise;
    try {
      const order = await readOrder(path);
      if (typeof order.orderNumber === "string") used.add(order.orderNumber);
    } catch {}
    return used;
  }, Promise.resolve(new Set<string>()));

  const used = await existingOrders;
  const orderNumber = newOrderNumber(used);
  const orderId = `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();

  const items = data.items.map((item: any, index: number) => ({
    id: `itm_${orderId}_${index}`,
    orderId,
    productId: typeof item.productId === "string" ? item.productId : null,
    productName: String(item.productName ?? "G3D Squish"),
    lineName: String(item.lineName ?? "G3D Squish"),
    shape: String(item.shape ?? ""),
    color: String(item.color ?? ""),
    firmness: String(item.firmness ?? ""),
    texture: String(item.texture ?? ""),
    quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
    unitPriceCents: Math.max(0, Math.round(Number(item.unitPriceCents) || 0)),
    personalization: String(item.personalization ?? "").trim().slice(0, 80),
    g3dpg: {
      ...(item.g3dpg ?? {}),
      customName: String(item.personalization ?? item.g3dpg?.customName ?? ""),
      orderNumber,
      productName: String(item.productName ?? "G3D Squish"),
      color: String(item.color ?? ""),
      firmness: String(item.firmness ?? ""),
      texture: String(item.texture ?? ""),
      quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
    },
  }));

  const order = {
    id: orderId,
    orderNumber,
    customerName: data.customerName.trim().slice(0, 80),
    status: "new",
    totalCents: items.reduce(
      (sum: number, item: any) => sum + item.unitPriceCents * item.quantity,
      0,
    ),
    notes: "",
    createdAt: now,
    items,
  };

  await writeFile(
    `${ORDERS_PATH}/${orderId}.json`,
    JSON.stringify(order, null, 2) + "\n",
    `Add G3D order ${orderNumber}`,
  );

  return {
    orderId,
    orderNumber,
    totalCents: order.totalCents,
  };
}

async function listOrders(data: any) {
  assertAdmin(data?.adminCode);
  const orders: any[] = [];
  for (const path of await listOrderPaths()) {
    try {
      orders.push(await readOrder(path));
    } catch {}
  }
  return orders.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function getOrder(data: any) {
  if (!data || typeof data.orderNumber !== "string") throw new Error("Invalid order number.");
  for (const path of await listOrderPaths()) {
    try {
      const order = await readOrder(path);
      if (order.orderNumber === data.orderNumber) return order;
    } catch {}
  }
  return null;
}

async function updateOrderStatus(data: any) {
  assertAdmin(data?.adminCode);
  const allowed = new Set(["new", "making", "ready", "completed", "cancelled"]);
  if (!allowed.has(data?.status)) throw new Error("Invalid order status.");

  const path = `${ORDERS_PATH}/${data.orderId}.json`;
  const file = await getFile(path);
  const order = JSON.parse(decode(file.content));
  const updated = { ...order, status: data.status };

  await writeFile(
    path,
    JSON.stringify(updated, null, 2) + "\n",
    `Update order ${order.orderNumber} status to ${data.status}`,
    file.sha,
  );

  return { ok: true };
}

export default async function handler(req: Req, res: Res) {
  cors(res);

  if ((req.method ?? "GET").toUpperCase() === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if ((req.method ?? "GET").toUpperCase() !== "POST") {
    send(res, 405, { ok: false, error: "POST required." });
    return;
  }

  try {
    const body = (req.body ?? {}) as { action?: string; data?: any };

    let result: unknown;
    switch (body.action) {
      case "placeOrder":
        result = await placeOrder(body.data);
        break;
      case "listOrders":
        result = await listOrders(body.data);
        break;
      case "getOrder":
        result = await getOrder(body.data);
        break;
      case "updateOrderStatus":
        result = await updateOrderStatus(body.data);
        break;
      default:
        send(res, 400, { ok: false, error: "Unknown action." });
        return;
    }

    send(res, 200, { ok: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    send(res, 400, { ok: false, error: message });
  }
}
