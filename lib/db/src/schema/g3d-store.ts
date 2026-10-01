import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

type CatalogSnapshot = {
  lines: unknown[];
  products: unknown[];
};

export const g3dCatalogState = pgTable("g3d_catalog_state", {
  id: text("id").primaryKey(),
  catalog: jsonb("catalog").$type<CatalogSnapshot>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const g3dStoreOrders = pgTable("g3d_store_orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  orderData: jsonb("order_data").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});