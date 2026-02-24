import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { hash } from "bcryptjs";
import * as schema from "./schema";
import { organizations, auctions, users, auctionItems } from "./schema";

async function seed() {
  const sqlite = new Database("sqlite.db");
  const db = drizzle(sqlite, { schema });

  const now = Date.now();

  await db
    .insert(organizations)
    .values([
      {
        id: "org_0",
        name: "Acadia Wildlife Center",
        createdAt: now,
      },
      {
        id: "org_1",
        name: "Chicago Food Insecurity Network",
        createdAt: now,
      },
      {
        id: "org_2",
        name: "Westside Elementary School",
        createdAt: now,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(auctions)
    .values([
      {
        id: "auction_0",
        orgId: "org_0",
        name: "Fundraiser for a New Birds of Prey Enclosure",
        description:
          "We are fundraising to build a bigger birds of prey enclosure for our patients. This will allow us to care for more birds and provide a better experience for our visitors.",
        endsAt: now + 1000 * 60 * 60 * 48,
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "auction_1",
        orgId: "org_1",
        name: "Spring Gala 2026",
        description:
          "Annual fundraising gala for the Chicago Food Insecurity Network.",
        endsAt: now + 1000 * 60 * 60 * 48,
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "auction_2",
        orgId: "org_2",
        name: "Spring Fundraiser for School Supplies",
        description:
          "Westside Elementary School spring carnival silent auction to provide school supplies for our students.",
        endsAt: now + 1000 * 60 * 60 * 36,
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(auctionItems)
    .values([
      {
        id: "item_1",
        auctionId: "auction_0",
        title: "Barred Owl Art Print",
        description:
          "Stunning framed art print of a Barred Owl (Strix Varia) perched in an autumn forest, rendered in a bold, graphic illustration style with rich oranges and reds. Black frame included, ready to hang.",
        imageUrl: "/images/wildlife-center-items/barred-owl-print.jpg",
        startingBid: 6500,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "item_2",
        auctionId: "auction_0",
        title: "Maine Loon Sunset Throw Blanket",
        description:
          "Cozy oversized throw blanket featuring a pair of Common Loons gliding across a golden sunset lake, framed by Maine pines. Soft fleece, full bed size. A perfect Maine cabin companion.",
        imageUrl: "/images/wildlife-center-items/loon-blanket.jpg",
        startingBid: 5500,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "item_3",
        auctionId: "auction_0",
        title: "Maine State Animals Ceramic Mug",
        description:
          "Large white ceramic mug illustrated with Maine's official state animals: the Moose, Honeybee, Maine Coon Cat, Landlocked Salmon, and Black-Capped Chickadee. A perfect gift for the Maine naturalist.",
        imageUrl: "/images/wildlife-center-items/mug.png",
        startingBid: 2200,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "item_4",
        auctionId: "auction_0",
        title: "Stained Glass Woodpecker Suncatcher",
        description:
          "Handcrafted stained glass suncatcher featuring a pair of Downy Woodpeckers perched on a branch with green leaves. Hung by delicate silver chains, this piece casts beautiful shadows in any sunny window.",
        imageUrl: "/images/wildlife-center-items/glass-art.jpg",
        startingBid: 8500,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "item_5",
        auctionId: "auction_0",
        title: "Embroidered Fox Converse High-Tops",
        description:
          "One-of-a-kind custom Converse Chuck Taylor 70s in forest green, hand-embroidered with a sleeping red fox surrounded by wildflowers, strawberries, and mushrooms. A wearable work of art. Size 8.",
        imageUrl: "/images/wildlife-center-items/shoes.jpg",
        startingBid: 12000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "item_6",
        auctionId: "auction_0",
        title: "Needle Felted Baby Raccoon Family",
        description:
          "Whimsical set of four needle-felted wool raccoon kits clinging to a birch branch display. Incredibly detailed and lifelike, handmade by a local fiber artist. A charming nod to one of wildlife rehab's most frequent patients.",
        imageUrl: "/images/wildlife-center-items/felted-racoons.jpg",
        startingBid: 9500,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "item_7",
        auctionId: "auction_0",
        title: "Embroidered Skunk Ball Cap",
        description:
          "Washed olive green adjustable baseball cap with a detailed embroidered skunk on the front. A charming hat for wildlife lovers and a conversation starter. One size fits most.",
        imageUrl: "/images/wildlife-center-items/skunk-hat.jpg",
        startingBid: 2800,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "item_8",
        auctionId: "auction_0",
        title: "Carved Wooden Fox Sculpture Set",
        description:
          "A charming pair of hand-carved wooden fox sculptures, ideal for a mantle, shelf, or garden. Crafted from sustainably sourced wood with natural grain detail. A timeless piece of Maine folk art.",
        imageUrl: "/images/wildlife-center-items/wooden-foxes.avif",
        startingBid: 11000,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(users)
    .values([
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
    ])
    .onConflictDoNothing();

  console.log("Seed complete.");
}

seed();
