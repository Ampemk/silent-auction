import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(), // slug or UUID
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: integer("created_at").notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  password: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "bidder"] })
    .default("bidder")
    .notNull(),
  orgId: text("org_id").references(() => organizations.id),
  createdAt: integer("created_at").notNull(),
});

export const auctions = sqliteTable("auctions", {
  id: text("id").primaryKey(),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  endsAt: integer("ends_at").notNull(), // Unix timestamp
  status: text("status", { enum: ["draft", "active", "completed"] })
    .default("draft")
    .notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const auctionItems = sqliteTable("auction_items", {
  id: text("id").primaryKey(),
  auctionId: text("auction_id")
    .notNull()
    .references(() => auctions.id),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  startingBid: integer("starting_bid").notNull(), // stored in cents
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const bids = sqliteTable("bids", {
  id: text("id").primaryKey(),
  itemId: text("item_id")
    .notNull()
    .references(() => auctionItems.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  amount: integer("amount").notNull(), // stored in cents
  createdAt: integer("created_at").notNull(),
});
