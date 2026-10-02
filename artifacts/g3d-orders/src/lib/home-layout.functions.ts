import { createServerFn } from "@tanstack/react-start";
import { db, g3dCatalogState } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  DEFAULT_HOME_LAYOUT,
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
    await db
      .insert(g3dCatalogState)
      .values({ id: HOME_ID, catalog: layout as unknown as Record<string, unknown> })
      .onConflictDoUpdate({
        target: g3dCatalogState.id,
        set: { catalog: layout as unknown as Record<string, unknown>, updatedAt: new Date() },
      });
    return { ok: true as const, layout };
  });

/** Client-side fallback for static / GitHub Pages builds. */
const LS_KEY = "g3d-home-layout-v1";

export function loadHomeLayoutClient(): HomeLayout {
  if (typeof window === "undefined") return { ...DEFAULT_HOME_LAYOUT };
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_HOME_LAYOUT };
    return mergeHomeLayout(JSON.parse(raw) as Partial<HomeLayout>);
  } catch {
    return { ...DEFAULT_HOME_LAYOUT };
  }
}

export function saveHomeLayoutClient(layout: HomeLayout) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(mergeHomeLayout(layout)));
}

export type { HomeLayout, TextStyle };
