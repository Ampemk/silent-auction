import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { hash } from "bcryptjs";
import * as schema from "./schema";
import { organizations, auctions, auctionItems, bids, users } from "./schema";

async function seed() {
  const sqlite = new Database("sqlite.db");
  const db = drizzle(sqlite, { schema });

  const now = Date.now();
  const nowSec = Math.floor(now / 1000); // seconds, used for bid timestamps

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
    {
      id: "user_3",
      email: "sarah.johnson@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      password: await hash("password123", 12),
      role: "bidder",
      orgId: null,
      createdAt: now,
    },
    {
      id: "user_4",
      email: "marcus.chen@example.com",
      firstName: "Marcus",
      lastName: "Chen",
      password: await hash("password123", 12),
      role: "bidder",
      orgId: null,
      createdAt: now,
    },
    {
      id: "user_5",
      email: "emma.davis@example.com",
      firstName: "Emma",
      lastName: "Davis",
      password: await hash("password123", 12),
      role: "bidder",
      orgId: null,
      createdAt: now,
    },
    {
      id: "user_6",
      email: "tom.wilson@example.com",
      firstName: "Tom",
      lastName: "Wilson",
      password: await hash("password123", 12),
      role: "bidder",
      orgId: null,
      createdAt: now,
    },
  ]).onConflictDoNothing();

  await db.insert(auctionItems).values([
    {
      id: "item_1",
      auctionId: "auction_1",
      title: "Signed Michael Jordan Jersey",
      description: "Authentic 1996 Chicago Bulls jersey signed by MJ himself.",
      startingBid: 50000, // $500
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "item_2",
      auctionId: "auction_1",
      title: "Weekend Getaway – Napa Valley",
      description: "Two nights for two at a boutique vineyard hotel. Includes wine tasting and private tour.",
      startingBid: 40000, // $400
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "item_3",
      auctionId: "auction_1",
      title: "Custom Oil Portrait",
      description: "Commission a 24\"x36\" oil painting by local artist Dana Reeves.",
      startingBid: 20000, // $200
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "item_4",
      auctionId: "auction_1",
      title: "Chef's Table for 6",
      description: "Private dining experience at Maison Rouge. 7-course tasting menu with wine pairings.",
      startingBid: 60000, // $600
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "item_5",
      auctionId: "auction_1",
      title: "Apple Vision Pro",
      description: "Brand new, unopened Apple Vision Pro (256GB). Donated by TechForGood sponsors.",
      startingBid: 150000, // $1,500
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "item_6",
      auctionId: "auction_2",
      title: "Principal for a Day",
      description: "One lucky student gets to be principal for the day.",
      startingBid: 5000, // $50
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "item_7",
      auctionId: "auction_2",
      title: "Pizza Party for the Class",
      description: "Winner's class gets a full pizza party lunch, sponsored by Westside PTA.",
      startingBid: 10000, // $100
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "item_8",
      auctionId: "auction_2",
      title: "Handmade Gift Basket",
      description: "Curated gift basket with local jams, candles, and baked goods.",
      startingBid: 7500, // $75
      createdAt: now,
      updatedAt: now,
    },
  ]).onConflictDoNothing();

  const hr = 3600; // seconds per hour
  await db.insert(bids).values([
    // item_1: Signed Jordan Jersey — 5 bids
    { id: "bid_1_1", itemId: "item_1", userId: "user_3", amount: 55000, createdAt: nowSec - hr * 10 },
    { id: "bid_1_2", itemId: "item_1", userId: "user_4", amount: 70000, createdAt: nowSec - hr * 8 },
    { id: "bid_1_3", itemId: "item_1", userId: "user_5", amount: 90000, createdAt: nowSec - hr * 6 },
    { id: "bid_1_4", itemId: "item_1", userId: "user_3", amount: 110000, createdAt: nowSec - hr * 4 },
    { id: "bid_1_5", itemId: "item_1", userId: "user_6", amount: 125000, createdAt: nowSec - hr * 1 },

    // item_2: Napa Valley Getaway — 4 bids
    { id: "bid_2_1", itemId: "item_2", userId: "user_5", amount: 42000, createdAt: nowSec - hr * 9 },
    { id: "bid_2_2", itemId: "item_2", userId: "user_6", amount: 55000, createdAt: nowSec - hr * 7 },
    { id: "bid_2_3", itemId: "item_2", userId: "user_3", amount: 72000, createdAt: nowSec - hr * 5 },
    { id: "bid_2_4", itemId: "item_2", userId: "user_4", amount: 87500, createdAt: nowSec - hr * 2 },

    // item_3: Custom Oil Portrait — 3 bids
    { id: "bid_3_1", itemId: "item_3", userId: "user_4", amount: 22000, createdAt: nowSec - hr * 8 },
    { id: "bid_3_2", itemId: "item_3", userId: "user_6", amount: 28000, createdAt: nowSec - hr * 5 },
    { id: "bid_3_3", itemId: "item_3", userId: "user_5", amount: 32000, createdAt: nowSec - hr * 2 },

    // item_4: Chef's Table — 1 bid
    { id: "bid_4_1", itemId: "item_4", userId: "user_3", amount: 60000, createdAt: nowSec - hr * 3 },

    // item_5: Apple Vision Pro — 6 bids
    { id: "bid_5_1", itemId: "item_5", userId: "user_6", amount: 155000, createdAt: nowSec - hr * 12 },
    { id: "bid_5_2", itemId: "item_5", userId: "user_3", amount: 165000, createdAt: nowSec - hr * 10 },
    { id: "bid_5_3", itemId: "item_5", userId: "user_4", amount: 180000, createdAt: nowSec - hr * 8 },
    { id: "bid_5_4", itemId: "item_5", userId: "user_5", amount: 195000, createdAt: nowSec - hr * 6 },
    { id: "bid_5_5", itemId: "item_5", userId: "user_6", amount: 205000, createdAt: nowSec - hr * 3 },
    { id: "bid_5_6", itemId: "item_5", userId: "user_3", amount: 210000, createdAt: nowSec - hr * 1 },

    // item_6: Principal for a Day — 4 bids
    { id: "bid_6_1", itemId: "item_6", userId: "user_4", amount: 6000, createdAt: nowSec - hr * 7 },
    { id: "bid_6_2", itemId: "item_6", userId: "user_5", amount: 9000, createdAt: nowSec - hr * 5 },
    { id: "bid_6_3", itemId: "item_6", userId: "user_3", amount: 12500, createdAt: nowSec - hr * 3 },
    { id: "bid_6_4", itemId: "item_6", userId: "user_6", amount: 15000, createdAt: nowSec - hr * 1 },

    // item_7: Pizza Party — 2 bids
    { id: "bid_7_1", itemId: "item_7", userId: "user_5", amount: 11000, createdAt: nowSec - hr * 4 },
    { id: "bid_7_2", itemId: "item_7", userId: "user_4", amount: 15000, createdAt: nowSec - hr * 2 },

    // item_8: Gift Basket — no bids
  ]).onConflictDoNothing();

  console.log("Seed complete.");
}

seed();
