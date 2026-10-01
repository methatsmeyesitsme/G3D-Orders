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

export type GalleryItem = {
  url: string;
  kind: "image" | "gif" | "video";
  alt?: string;
};

export type ExtraSettings = {
  quality?: string;
  walls?: boolean;
  wallThickness?: number;
  rounded?: boolean;
  cornerRadius?: number;
  periodsOverride?: number;
  thicknessOverride?: number;
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
  items: OrderItem[];
};

export const ORDER_STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "making", label: "Making" },
  { id: "ready", label: "Ready" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];
