import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { organizations, auctions, auctionItems } from "@/db/schema";
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
          currentBid: i.startingBid,
          bidsCount: 0,
        })),
    ])
  );

  return (
    <AuctionsDashboard
      org={{ id: org.id, name: org.name }}
      auctions={mappedAuctions}
      itemsByAuction={itemsByAuction}
    />
  );
}
