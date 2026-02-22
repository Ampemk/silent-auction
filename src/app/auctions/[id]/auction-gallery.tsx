"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Auction } from "@/lib/auction-data";
import { MOCK_ITEMS } from "@/lib/auction-data";
import { useBidder } from "@/lib/bidder-context";
import AuctionItemCard from "./auction-item-card";
import PaymentVerification from "./payment-verification";
import BidModal from "./bid-modal";

function GavelIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m14.5 12.5-8 8a2.12 2.12 0 1 1-3-3l8-8" /><path d="m16 16 6-6" /><path d="m8 8 6-6" /><path d="m9 7 8 8" /><path d="m21 11-8-8" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AuctionGallery({ auction }: { auction: Auction }) {
  const { isVerified, bidderName } = useBidder();
  const [showPayment, setShowPayment] = useState(false);
  const [bidItem, setBidItem] = useState<string | null>(null);
  const [items, setItems] = useState(MOCK_ITEMS);

  const handleBidClick = (itemId: string) => {
    if (!isVerified) {
      setShowPayment(true);
    } else {
      setBidItem(itemId);
    }
  };

  const handleBidSubmit = (itemId: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newBid = {
            id: `bid-new-${Date.now()}`,
            bidderName: bidderName || "You",
            amount,
            timestamp: new Date().toISOString(),
          };
          return {
            ...item,
            currentBid: amount,
            totalBids: item.totalBids + 1,
            bids: [newBid, ...item.bids],
          };
        }
        return item;
      })
    );
    setBidItem(null);
  };

  const selectedItem = items.find((i) => i.id === bidItem);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <GavelIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-foreground">BidWell</span>
          </Link>
          {isVerified && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <CheckCircleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Verified</span>
            </div>
          )}
        </div>
      </header>

      {/* Auction Info Banner */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={auction.coverImage}
            alt=""
            fill
            className="object-cover opacity-15 blur-sm"
            sizes="100vw"
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 py-6">
          <Link href="/auctions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
            <ArrowLeftIcon className="h-4 w-4" />
            All auctions
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{auction.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{auction.organization}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono">{items.length} items</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              Ends {formatDate(auction.endsAt)}
            </span>
            {auction.isLive && (
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                Live
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verification Banner */}
      {!isVerified && (
        <div className="bg-accent/50 border-b border-border">
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-foreground">
              <strong>Verify to bid.</strong>{" "}
              <span className="text-muted-foreground">A $1 refundable deposit unlocks bidding on all items in this auction.</span>
            </p>
            <button
              onClick={() => setShowPayment(true)}
              className="flex-shrink-0 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Verify Now
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <section className="max-w-5xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <AuctionItemCard
              key={item.id}
              item={item}
              onBidClick={() => handleBidClick(item.id)}
              isVerified={isVerified}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GavelIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">BidWell</span>
          </div>
          <p className="text-xs text-muted-foreground">Trusted silent auction platform</p>
        </div>
      </footer>

      {/* Payment Verification Modal */}
      {showPayment && (
        <PaymentVerification onClose={() => setShowPayment(false)} />
      )}

      {/* Bid Modal */}
      {bidItem && selectedItem && (
        <BidModal
          item={selectedItem}
          onClose={() => setBidItem(null)}
          onSubmit={handleBidSubmit}
        />
      )}
    </main>
  );
}
