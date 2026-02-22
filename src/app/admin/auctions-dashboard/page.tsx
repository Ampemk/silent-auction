import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { auctions, auctionItems } from "@/db/schema";
import { getCurrentOrg } from "@/lib/auctions";
import { AuctionsDashboard } from "@/components/AuctionsDashboard";

export default async function AuctionsDashboardPage() {
  const org = getCurrentOrg();

  const dbAuctions = await db
    .select()
    .from(auctions)
    .where(eq(auctions.orgId, org.id));

  const dbItems = dbAuctions.length > 0
    ? await db
        .select()
        .from(auctionItems)
        .where(inArray(auctionItems.auctionId, dbAuctions.map((a) => a.id)))
    : [];

  const mappedAuctions = dbAuctions.map((a) => ({
    ...a,
    endsAt: new Date(a.endsAt),
  }));

  const itemsByAuction = Object.fromEntries(
    dbAuctions.map((a) => [
      a.id,
      dbItems
        .filter((i) => i.auctionId === a.id)
        .map((i) => ({
          id: i.id,
          auctionId: i.auctionId,
          title: i.title,
          description: i.description ?? "",
          imageUrl: i.imageUrl,
          startingBid: i.startingBid,
          currentBid: i.startingBid, // derived from bids once bidding is wired up
          bidsCount: 0,             // derived from bids once bidding is wired up
        })),
    ])
  );

  return <AuctionsDashboard org={org} auctions={mappedAuctions} itemsByAuction={itemsByAuction} />;
}
