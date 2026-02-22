import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { hash } from "bcryptjs";
import * as schema from "./schema";
import { organizations, auctions, users } from "./schema";

async function seed() {
  const sqlite = new Database("sqlite.db");
  const db = drizzle(sqlite, { schema });

  const now = Date.now();

  await db.insert(organizations).values([
    {
      id: "org_1",
      name: "Riverdale Community Foundation",
      createdAt: now,
    },
    {
      id: "org_2",
      name: "Westside Elementary PTA",
      createdAt: now,
    },
  ]).onConflictDoNothing();

  await db.insert(auctions).values([
    {
      id: "auction_1",
      orgId: "org_1",
      name: "Spring Gala 2026",
      description: "Annual fundraising gala for the Riverdale Community Foundation.",
      endsAt: now + 1000 * 60 * 60 * 48,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "auction_2",
      orgId: "org_2",
      name: "Spring Carnival Fundraiser",
      description: "Westside Elementary PTA spring carnival silent auction.",
      endsAt: now + 1000 * 60 * 60 * 36,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ]).onConflictDoNothing();

  await db.insert(users).values([
    {
      id: "user_1",
      email: "admin@riverdale.org",
      firstName: "Admin",
      lastName: "User",
      password: await hash("password123", 12),
      role: "admin",
      orgId: "org_1",
      createdAt: now,
    },
    {
      id: "user_2",
      email: "admin@westside.org",
      firstName: "Admin",
      lastName: "User",
      password: await hash("password123", 12),
      role: "admin",
      orgId: "org_2",
      createdAt: now,
    },
  ]).onConflictDoNothing();

  console.log("Seed complete.");
}

seed();
