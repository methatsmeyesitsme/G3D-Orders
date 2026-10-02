/** Editable front-page layout used by the store and admin Preview. */

export type TextStyle = {
  fontFamily: "display" | "sans" | "mono";
  fontSizePx: number;
  color: string;
  fontWeight: number;
};

/** Position as percent of the home canvas (0–100). */
export type LayoutPos = { x: number; y: number };

export type LayoutPositions = {
  heroEyebrow: LayoutPos | null;
  heroTitle: LayoutPos | null;
  heroBody: LayoutPos | null;
  heroMedia: LayoutPos | null;
  linesHeading: LayoutPos | null;
  /** product-line id → position */
  lines: Record<string, LayoutPos>;
};

/** Keys that can be hidden from the storefront (and preview). */
export type LayoutElementKey =
  | "heroEyebrow"
  | "heroTitle"
  | "heroBody"
  | "heroMedia"
  | "linesHeading"
  | `line:${string}`;

export type HomeLayout = {
  version: 1;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  linesHeading: string;
  featuredHeadingPrefix: string;
  heroEyebrowStyle: TextStyle;
  heroTitleStyle: TextStyle;
  heroBodyStyle: TextStyle;
  linesHeadingStyle: TextStyle;
  /** "text-left" = copy left, media right; "text-right" swaps (flow mode only) */
  heroPlacement: "text-left" | "text-right";
  /** Order of product-line cards on the home page (line ids). Missing ids append at end. */
  lineOrder: string[];
  linesGridCols: 1 | 2 | 3;
  /** When true, text and product cards use free absolute positions. */
  freeLayout: boolean;
  positions: LayoutPositions;
  /** Element keys removed via Preview delete (restored by Reset / Undo). */
  hiddenElements: string[];
};

export const DEFAULT_POSITIONS: LayoutPositions = {
  heroEyebrow: null,
  heroTitle: null,
  heroBody: null,
  heroMedia: null,
  linesHeading: null,
  lines: {},
};

export const DEFAULT_HOME_LAYOUT: HomeLayout = {
  version: 1,
  heroEyebrow: "Product studio",
  heroTitle: "Lattice you can hold.",
  heroBody:
    "G3D Squish is printed to the options on the ticket. Shape, filament, yield, grain — then GO sends the same spec into G3DPG.",
  linesHeading: "Product lines",
  featuredHeadingPrefix: "In",
  heroEyebrowStyle: {
    fontFamily: "sans",
    fontSizePx: 11,
    color: "",
    fontWeight: 500,
  },
  heroTitleStyle: {
    fontFamily: "display",
    fontSizePx: 48,
    color: "",
    fontWeight: 600,
  },
  heroBodyStyle: {
    fontFamily: "sans",
    fontSizePx: 16,
    color: "",
    fontWeight: 400,
  },
  linesHeadingStyle: {
    fontFamily: "display",
    fontSizePx: 24,
    color: "",
    fontWeight: 600,
  },
  heroPlacement: "text-left",
  lineOrder: [],
  linesGridCols: 2,
  freeLayout: false,
  positions: { ...DEFAULT_POSITIONS, lines: {} },
  hiddenElements: [],
};

export function mergeHomeLayout(partial?: Partial<HomeLayout> | null): HomeLayout {
  if (!partial) {
    return {
      ...DEFAULT_HOME_LAYOUT,
      positions: { ...DEFAULT_POSITIONS, lines: {} },
      hiddenElements: [],
    };
  }
  const positionsIn = partial.positions;
  return {
    ...DEFAULT_HOME_LAYOUT,
    ...partial,
    version: 1,
    freeLayout: Boolean(partial.freeLayout),
    heroEyebrowStyle: {
      ...DEFAULT_HOME_LAYOUT.heroEyebrowStyle,
      ...(partial.heroEyebrowStyle || {}),
    },
    heroTitleStyle: {
      ...DEFAULT_HOME_LAYOUT.heroTitleStyle,
      ...(partial.heroTitleStyle || {}),
    },
    heroBodyStyle: {
      ...DEFAULT_HOME_LAYOUT.heroBodyStyle,
      ...(partial.heroBodyStyle || {}),
    },
    linesHeadingStyle: {
      ...DEFAULT_HOME_LAYOUT.linesHeadingStyle,
      ...(partial.linesHeadingStyle || {}),
    },
    lineOrder: Array.isArray(partial.lineOrder)
      ? partial.lineOrder
      : DEFAULT_HOME_LAYOUT.lineOrder,
    positions: {
      heroEyebrow: positionsIn?.heroEyebrow ?? null,
      heroTitle: positionsIn?.heroTitle ?? null,
      heroBody: positionsIn?.heroBody ?? null,
      heroMedia: positionsIn?.heroMedia ?? null,
      linesHeading: positionsIn?.linesHeading ?? null,
      lines: { ...(positionsIn?.lines || {}) },
    },
    hiddenElements: Array.isArray(partial.hiddenElements)
      ? [...partial.hiddenElements]
      : [],
  };
}

export function isHidden(layout: HomeLayout, key: string): boolean {
  return layout.hiddenElements.includes(key);
}

export function textStyleCss(style: TextStyle): Record<string, string | number | undefined> {
  const fontFamily =
    style.fontFamily === "display"
      ? "var(--font-serif), ui-serif, Georgia, serif"
      : style.fontFamily === "mono"
        ? "var(--font-mono), ui-monospace, monospace"
        : "var(--font-sans), ui-sans-serif, system-ui, sans-serif";
  return {
    fontFamily,
    fontSize: `${style.fontSizePx}px`,
    fontWeight: style.fontWeight,
    ...(style.color ? { color: style.color } : {}),
  };
}

export function posStyle(pos: LayoutPos | null | undefined): Record<string, string | number | undefined> | undefined {
  if (!pos) return undefined;
  return {
    position: "absolute",
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    maxWidth: "42%",
  };
}

export function orderLines<T extends { id: string }>(
  lines: T[],
  order: string[],
): T[] {
  if (!order.length) return lines;
  const map = new Map(lines.map((l) => [l.id, l]));
  const ordered: T[] = [];
  for (const id of order) {
    const hit = map.get(id);
    if (hit) {
      ordered.push(hit);
      map.delete(id);
    }
  }
  for (const rest of map.values()) ordered.push(rest);
  return ordered;
}
