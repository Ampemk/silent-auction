"use server";

import { db } from "@/db";
import { auctionItems } from "@/db/schema";

export async function addAuctionItem(input: {
  auctionId: string;
  title: string;
  description: string;
  imageData: string | null;
  startingBidCents: number;
}) {
  const now = Date.now();

  await db.insert(auctionItems).values({
    id: crypto.randomUUID(),
    auctionId: input.auctionId,
    title: input.title,
    description: input.description || null,
    imageUrl: input.imageData ?? null, // stored as base64 data URL
    startingBid: input.startingBidCents,
    createdAt: now,
    updatedAt: now,
  });
}
