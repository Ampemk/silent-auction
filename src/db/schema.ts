import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // This could be the value of your authToken
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

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(), // slug or UUID
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: integer("created_at").notNull(),
});
