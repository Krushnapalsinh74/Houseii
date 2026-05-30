import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const propertiesTable = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  priceUnit: text("price_unit").notNull().default("Lac"),
  location: text("location").notNull(),
  area: real("area"),
  areaUnit: text("area_unit").notNull().default("sq.ft"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  type: text("type").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("available"),
  featured: boolean("featured").notNull().default(false),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
  builderName: text("builder_name"),
  possession: text("possession"),
  rera: text("rera"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({ id: true, createdAt: true });
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;
