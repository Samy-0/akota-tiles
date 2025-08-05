import { pgTable, serial, varchar, integer, decimal, text, timestamp } from "drizzle-orm/pg-core"

export const tiles = pgTable("tiles", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }),
  grade: varchar("grade", { length: 10 }),
  size: varchar("size", { length: 100 }),
  quantity: integer("quantity").default(0).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Tile = typeof tiles.$inferSelect
export type NewTile = typeof tiles.$inferInsert
