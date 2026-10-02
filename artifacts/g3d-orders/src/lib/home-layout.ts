/** Editable front-page layout used by the store and admin Preview. */

export type TextStyle = {
  fontFamily: "display" | "sans" | "mono";
  fontSizePx: number;
  color: string;
  fontWeight: number;
};

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
  /** "text-left" = copy left, media right; "text-right" swaps */
  heroPlacement: "text-left" | "text-right";
  /** Order of product-line cards on the home page (line ids). Missing ids append at end. */
  lineOrder: string[];
  linesGridCols: 1 | 2 | 3;
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
};

export function mergeHomeLayout(partial?: Partial<HomeLayout> | null): HomeLayout {
  if (!partial) return { ...DEFAULT_HOME_LAYOUT };
  return {
    ...DEFAULT_HOME_LAYOUT,
    ...partial,
    version: 1,
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
  };
}

export function textStyleCss(style: TextStyle): React.CSSProperties {
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

// Avoid importing React types in a pure module for CSSProperties
declare namespace React {
  type CSSProperties = Record<string, string | number | undefined>;
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
