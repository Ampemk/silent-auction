import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { organizations, auctions, auctionItems, bids, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { AuctionsDashboard } from "@/components/AuctionsDashboard";

export default async function AuctionsDashboardPage() {
  const session = await getSession();
  if (!session?.orgId) redirect("/login");

  const org = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, session.orgId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!org) redirect("/login");

  const dbAuctions = await db
    .select()
    .from(auctions)
    .where(eq(auctions.orgId, org.id));

  const dbItems =
    dbAuctions.length > 0
      ? await db
          .select()
          .from(auctionItems)
          .where(inArray(auctionItems.auctionId, dbAuctions.map((a) => a.id)))
      : [];

  const dbBids =
    dbItems.length > 0
      ? await db
          .select({
            id: bids.id,
            itemId: bids.itemId,
            amount: bids.amount,
            createdAt: bids.createdAt,
            firstName: users.firstName,
            lastName: users.lastName,
          })
          .from(bids)
          .leftJoin(users, eq(bids.userId, users.id))
          .where(inArray(bids.itemId, dbItems.map((i) => i.id)))
          .orderBy(desc(bids.amount))
      : [];

  // Group bids by itemId
  const bidsByItem = Object.fromEntries(
    dbItems.map((item) => [
      item.id,
      dbBids
        .filter((b) => b.itemId === item.id)
        .map((b) => ({
          id: b.id,
          amount: b.amount,
          createdAt: b.createdAt,
          bidderName:
            `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim() || "Anonymous",
        })),
    ])
  );

  const mappedAuctions = dbAuctions.map((a) => ({
    ...a,
    endsAt: new Date(a.endsAt),
  }));

  const itemsByAuction = Object.fromEntries(
    dbAuctions.map((a) => [
      a.id,
      dbItems
        .filter((i) => i.auctionId === a.id)
        .map((i) => {
          const itemBids = bidsByItem[i.id] ?? [];
          const topBid = itemBids[0]; // already sorted desc by amount
          return {
            id: i.id,
            auctionId: i.auctionId,
            title: i.title,
            description: i.description ?? "",
            imageUrl: i.imageUrl,
            startingBid: i.startingBid,
            currentBid: topBid ? topBid.amount : i.startingBid,
            bidsCount: itemBids.length,
          };
        }),
    ])
  );

  return (
    <AuctionsDashboard
      org={{ id: org.id, name: org.name }}
      auctions={mappedAuctions}
      itemsByAuction={itemsByAuction}
      bidsByItem={bidsByItem}
    />
  );
}
