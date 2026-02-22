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
  createdAt: integer("created_at").notNull(),
});
