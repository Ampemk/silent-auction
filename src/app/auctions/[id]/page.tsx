import { db } from "@/db";
import { auctions, organizations, auctionItems, bids, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import type { Auction, AuctionItem } from "@/lib/auction-data";
import { BidderProvider } from "@/lib/bidder-context";
import AuctionGallery from "./auction-gallery";

function GavelIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m14.5 12.5-8 8a2.12 2.12 0 1 1-3-3l8-8" /><path d="m16 16 6-6" /><path d="m8 8 6-6" /><path d="m9 7 8 8" /><path d="m21 11-8-8" />
    </svg>
  );
}

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rows = await db
    .select({
      id: auctions.id,
      name: auctions.name,
      endsAt: auctions.endsAt,
      status: auctions.status,
      organization: organizations.name,
    })
    .from(auctions)
    .innerJoin(organizations, eq(auctions.orgId, organizations.id))
    .where(eq(auctions.id, id))
    .limit(1);

  const row = rows[0];

  if (!row) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <GavelIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Auction not found</h1>
          <p className="mt-2 text-muted-foreground">This auction may have ended or the link may be incorrect.</p>
        </div>
      </main>
    );
  }

  const auction: Auction = {
    id: row.id,
    title: row.name,
    organization: row.organization,
    endsAt: new Date(row.endsAt).toISOString(),
    isLive: row.status === "active",
  };

  // Get items with aggregated bid data
  const itemRows = await db
    .select({
      id: auctionItems.id,
      title: auctionItems.title,
      description: auctionItems.description,
      imageUrl: auctionItems.imageUrl,
      startingBid: auctionItems.startingBid,
      currentBid: sql<number>`coalesce(max(${bids.amount}), ${auctionItems.startingBid})`,
      totalBids: sql<number>`count(${bids.id})`,
    })
    .from(auctionItems)
    .leftJoin(bids, eq(auctionItems.id, bids.itemId))
    .where(eq(auctionItems.auctionId, id))
    .groupBy(auctionItems.id);

  // Get bid history with bidder names for all items in this auction
  const bidRows = await db
    .select({
      id: bids.id,
      itemId: bids.itemId,
      amount: bids.amount,
      createdAt: bids.createdAt,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(bids)
    .innerJoin(auctionItems, eq(bids.itemId, auctionItems.id))
    .innerJoin(users, eq(bids.userId, users.id))
    .where(eq(auctionItems.auctionId, id))
    .orderBy(desc(bids.amount));

  const bidsByItem = new Map<string, typeof bidRows>();
  for (const bid of bidRows) {
    const list = bidsByItem.get(bid.itemId) ?? [];
    list.push(bid);
    bidsByItem.set(bid.itemId, list);
  }

  const items: AuctionItem[] = itemRows.map((item) => {
    const itemBids = bidsByItem.get(item.id) ?? [];
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.imageUrl,
      currentBid: item.currentBid,
      totalBids: item.totalBids,
      bids: itemBids.map((b) => ({
        id: b.id,
        bidderName: `${b.firstName} ${b.lastName[0]}.`,
        amount: b.amount,
        timestamp: new Date(b.createdAt).toISOString(),
      })),
    };
  });

  return (
    <BidderProvider>
      <AuctionGallery auction={auction} initialItems={items} />
    </BidderProvider>
  );
}
