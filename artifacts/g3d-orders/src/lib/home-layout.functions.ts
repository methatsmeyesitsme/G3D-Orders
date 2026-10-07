import { createServerFn } from "@tanstack/react-start";
import { db, g3dCatalogState } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  mergeHomeLayout,
  type HomeLayout,
  type TextStyle,
} from "@/lib/home-layout";
import { assertStoreAccess } from "@/lib/store-access.server";

const ADMIN_CODE = process.env.G3D_ADMIN_PASSCODE?.trim() || "2004051315";
const HOME_ID = "home_layout";

const textStyleSchema = z.object({
  fontFamily: z.enum(["display", "sans", "mono"]),
  fontSizePx: z.number().min(8).max(120),
  color: z.string().max(40),
  fontWeight: z.number().min(100).max(900),
});

/** Accept slightly out-of-range floats from drag math and clamp. */
const posSchema = z.preprocess(
  (val) => {
    if (!val || typeof val !== "object") return val;
    const v = val as { x?: unknown; y?: unknown };
    const x = Number(v.x);
    const y = Number(v.y);
    return {
      x: Math.min(100, Math.max(0, Number.isFinite(x) ? x : 0)),
      y: Math.min(100, Math.max(0, Number.isFinite(y) ? y : 0)),
    };
  },
  z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }),
);

const positionsSchema = z.object({
  heroEyebrow: posSchema.nullable(),
  heroTitle: posSchema.nullable(),
  heroBody: posSchema.nullable(),
  heroMedia: posSchema.nullable(),
  linesHeading: posSchema.nullable(),
  lines: z.record(z.string(), posSchema).default({}),
  // Always keep product (standalone) card positions — do not strip on save
  products: z.record(z.string(), posSchema).default({}),
});

const customTextSchema = z.object({
  id: z.string().min(1).max(64),
  text: z.string().max(2000),
  style: textStyleSchema,
  pos: posSchema,
});

const homeLayoutSchema = z.object({
  version: z.literal(1),
  heroEyebrow: z.string().max(120),
  heroTitle: z.string().max(200),
  heroBody: z.string().max(2000),
  linesHeading: z.string().max(120),
  featuredHeadingPrefix: z.string().max(40),
  heroEyebrowStyle: textStyleSchema,
  heroTitleStyle: textStyleSchema,
  heroBodyStyle: textStyleSchema,
  linesHeadingStyle: textStyleSchema,
  heroPlacement: z.enum(["text-left", "text-right"]),
  lineOrder: z.array(z.string()),
  linesGridCols: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  freeLayout: z.boolean(),
  canvasHeightPx: z.number().min(480).max(3200).optional().default(720),
  positions: positionsSchema,
  hiddenElements: z.array(z.string()),
  customTexts: z.array(customTextSchema),
});

function assertAdmin(code: string) {
  if (code !== ADMIN_CODE) throw new Error("Admin access denied");
}

export const getHomeLayout = createServerFn({ method: "GET" }).handler(
  async () => {
    assertStoreAccess();
    const [row] = await db
      .select({ catalog: g3dCatalogState.catalog })
      .from(g3dCatalogState)
      .where(eq(g3dCatalogState.id, HOME_ID))
      .limit(1);
    return mergeHomeLayout(
      row ? (row.catalog as unknown as Partial<HomeLayout>) : null,
    );
  },
);

export const saveHomeLayout = createServerFn({ method: "POST" })
  .validator(
    z.object({
      adminCode: z.string(),
      layout: homeLayoutSchema,
    }),
  )
  .handler(async ({ data }) => {
    assertStoreAccess();
    assertAdmin(data.adminCode);
    const layout = mergeHomeLayout(data.layout);
    // Ensure products map is never dropped when writing
    if (!layout.positions.products) {
      layout.positions.products = {};
    }
    await db
      .insert(g3dCatalogState)
      .values({ id: HOME_ID, catalog: layout as unknown as Record<string, unknown> })
      .onConflictDoUpdate({
        target: g3dCatalogState.id,
        set: {
          catalog: layout as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        },
      });
    return { ok: true as const, layout };
  });

const LS_KEY = "g3d-home-layout-v1";

export function loadHomeLayoutClient(): HomeLayout {
  if (typeof window === "undefined") return mergeHomeLayout(null);
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return mergeHomeLayout(null);
    return mergeHomeLayout(JSON.parse(raw) as Partial<HomeLayout>);
  } catch {
    return mergeHomeLayout(null);
  }
}

export function saveHomeLayoutClient(layout: HomeLayout) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(mergeHomeLayout(layout)));
}

export function clearHomeLayoutClient() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_KEY);
}

export type { HomeLayout, TextStyle };
