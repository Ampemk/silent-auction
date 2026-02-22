import { MOCK_AUCTIONS } from "@/lib/auction-data";
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
  const auction = MOCK_AUCTIONS.find((a) => a.id === id);

  if (!auction) {
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

  return (
    <BidderProvider>
      <AuctionGallery auction={auction} />
    </BidderProvider>
  );
}
