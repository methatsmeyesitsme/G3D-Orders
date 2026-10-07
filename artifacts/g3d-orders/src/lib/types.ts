export type OptionMeta = {
  thickness?: number;
  periods?: number;
  toggle?: boolean;
  amount?: number;
};

export type OptionChoice = {
  id: string;
  label: string;
  priceDelta: number;
  hex?: string;
  g3dpgValue?: string;
  imageUrl?: string;
  meta?: OptionMeta;
};

/** Named region that gets its own color pick (e.g. "Rollers", "Base"). */
export type ColorPart = {
  id: string;
  label: string;
};

export type GalleryItem = {
  url: string;
  kind: "image" | "gif" | "video";
  alt?: string;
};

/** Slider design choice for products that use a slider. */
export type SliderMode = "click" | "no-click" | "none";

export type ExtraSettings = {
  quality?: string;
  walls?: boolean;
  wallThickness?: number;
  rounded?: boolean;
  cornerRadius?: number;
  periodsOverride?: number;
  thicknessOverride?: number;
  /**
   * Slider design:
   * - "click" = discrete clicks
   * - "no-click" = smooth / no clicks
   * - "none" = no slider treatment for this product
   */
  sliderMode?: SliderMode;
  /** @deprecated Prefer sliderMode. true = click, false = no-click. */
  sliderClicks?: boolean;
  /** When true, customer can toggle an optional second color. */
  secondColorOffer?: boolean;
  /** Flat surcharge (cents) added when the second-color switch is on. */
  secondColorPriceCents?: number;
  /** Label for the second color picker (default "Second color"). */
  secondColorLabel?: string;
};

export type ProductLine = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImageUrl: string;
  coverGifUrl: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  lineId: string;
  lineSlug?: string;
  lineName?: string;
  slug: string;
  name: string;
  description: string;
  basePriceCents: number;
  imageUrl: string;
  gifUrl: string;
  videoUrl: string;
  gallery: GalleryItem[];
  shapes: OptionChoice[];
  colors: OptionChoice[];
  /** When non-empty, customer picks a color for each named part. */
  colorParts: ColorPart[];
  firmnessOptions: OptionChoice[];
  textureEnabled: boolean;
  textureOptions: OptionChoice[];
  infillPattern: string;
  sizeMm: number;
  extraSettings: ExtraSettings;
  active: boolean;
  sortOrder: number;
};

export type Selection = {
  shape: string;
  color: string;
  /** part id → color option id (when product has colorParts) */
  partColors: Record<string, string>;
  /** Customer turned on the optional second color. */
  secondColorOn?: boolean;
  /** Color option id for the second color (when secondColorOn). */
  secondColor?: string;
  firmness: string;
  texture: string;
  quantity: number;
  personalization: string;
};

export type CartItem = {
  key: string;
  productId: string;
  productSlug: string;
  lineSlug: string;
  productName: string;
  lineName: string;
  imageUrl: string;
  selection: Selection;
  /** Human-readable labels for cart / admin order display */
  labels: {
    shape: string;
    color: string;
    firmness: string;
    texture: string;
  };
  unitPriceCents: number;
  g3dpg: G3dpgConfig;
};

export type G3dpgConfig = {
  shape: string;
  pattern: string;
  quality: string;
  periods: string;
  thickness: string;
  textureToggle: boolean;
  textureAmount: number;
  customName: string;
  size?: string;
  diameter?: string;
  height?: string;
  outerDiameter?: string;
  tubeDiameter?: string;
  wallsToggle?: boolean;
  wallThickness?: string;
  rounded?: boolean;
  cornerRadius?: string;
  color?: string;
  firmness?: string;
  texture?: string;
  quantity?: number;
  orderNumber?: string;
  productName?: string;
};

export type OrderStatus = "new" | "making" | "ready" | "completed" | "cancelled";

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  lineName: string;
  shape: string;
  color: string;
  firmness: string;
  texture: string;
  quantity: number;
  unitPriceCents: number;
  personalization: string;
  g3dpg: G3dpgConfig;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  totalCents: number;
  notes: string;
  createdAt: string;
  /** ISO timestamp set when status becomes completed */
  completedAt?: string;
  items: OrderItem[];
};

export const ORDER_STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "making", label: "Making" },
  { id: "ready", label: "Ready" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

/** Resolve slider mode from extra settings (supports legacy sliderClicks). */
export function resolveSliderMode(extra: ExtraSettings | undefined | null): SliderMode {
  if (!extra) return "click";
  if (extra.sliderMode === "click" || extra.sliderMode === "no-click" || extra.sliderMode === "none") {
    return extra.sliderMode;
  }
  if (extra.sliderClicks === false) return "no-click";
  if (extra.sliderClicks === true) return "click";
  return "click";
}
