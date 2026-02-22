import { getCurrentOrg, getAuctionsByOrg, getItemsByAuction } from "@/lib/auctions";
import { AuctionsDashboard } from "@/components/AuctionsDashboard";

export default function AuctionsDashboardPage() {
  const org = getCurrentOrg();
  const auctions = getAuctionsByOrg(org.id);
  const itemsByAuction = Object.fromEntries(
    auctions.map((a) => [a.id, getItemsByAuction(a.id)])
  );
  return <AuctionsDashboard org={org} auctions={auctions} itemsByAuction={itemsByAuction} />;
}
