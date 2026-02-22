"use client";

import { useState } from "react";
import Image from "next/image";
import type { AuctionItem } from "@/lib/auction-data";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const INITIAL_BID_COUNT = 5;

export default function AuctionItemCard({
  item,
  onBidClick,
  isVerified,
}: {
  item: AuctionItem;
  onBidClick: () => void;
  isVerified: boolean;
}) {
  const [showBids, setShowBids] = useState(false);
  const [visibleBids, setVisibleBids] = useState(INITIAL_BID_COUNT);

  const displayedBids = item.bids.slice(0, visibleBids);
  const hasMoreBids = item.bids.length > visibleBids;

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-md">
      {/* Item Image */}
      {item.image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Item Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground text-base leading-snug">{item.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Bid info */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Current bid</p>
            <p className="text-2xl font-bold text-foreground font-mono tracking-tight">
              {formatCurrency(item.currentBid)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {item.totalBids} bid{item.totalBids !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Bid Button */}
        <button
          onClick={onBidClick}
          className="mt-4 w-full bg-primary text-primary-foreground font-medium text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isVerified ? "Place a Bid" : "Make a Bid"}
        </button>

        {/* Expandable Bid History */}
        <div className="mt-3 border-t border-border pt-3">
          <button
            onClick={() => setShowBids(!showBids)}
            className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={showBids}
          >
            <span className="font-medium">Bid History</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${showBids ? "rotate-180" : ""}`}
            />
          </button>

          {showBids && (
            <div className="mt-2 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs" role="table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium text-muted-foreground pb-2 pr-3">Bidder</th>
                      <th className="text-right font-medium text-muted-foreground pb-2 pr-3">Amount</th>
                      <th className="text-right font-medium text-muted-foreground pb-2">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedBids.map((bid, i) => (
                      <tr
                        key={bid.id}
                        className={`${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"} border-b border-border/50 last:border-0`}
                      >
                        <td className="py-2 pr-3 truncate max-w-[100px]">{bid.bidderName}</td>
                        <td className="py-2 pr-3 text-right font-mono">{formatCurrency(bid.amount)}</td>
                        <td className="py-2 text-right whitespace-nowrap">{timeAgo(bid.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {hasMoreBids && (
                <button
                  onClick={() => setVisibleBids((prev) => prev + 5)}
                  className="mt-2 w-full text-xs text-primary font-medium hover:underline py-1"
                >
                  Load older bids ({item.bids.length - visibleBids} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
