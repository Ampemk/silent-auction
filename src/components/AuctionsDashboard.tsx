"use client";

import { Fragment, useState } from "react";
import { type Auction, type AuctionItem, type BidEntry } from "@/lib/auctions";
import { logoutAction } from "@/app/admin/actions";
import { NewAuctionDrawer } from "./NewAuctionDrawer";

function timeRemaining(endsAt: Date): { label: string; urgent: boolean } {
  const ms = endsAt.getTime() - Date.now();
  if (ms <= 0) return { label: "Ended", urgent: false };
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 24) return { label: `${Math.floor(hours / 24)}d ${hours % 24}h left`, urgent: false };
  if (hours > 0) return { label: `${hours}h ${minutes}m left`, urgent: hours < 3 };
  return { label: `${minutes}m left`, urgent: true };
}

function formatBidTime(createdAt: number): string {
  return new Date(createdAt * 1000).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const auctionStatusConfig: Record<
  Auction["status"],
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-600/20",
  },
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  },
  completed: {
    label: "Completed",
    className: "bg-zinc-100 text-zinc-500 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700/20",
  },
};

export function AuctionsDashboard({
  org,
  auctions,
  itemsByAuction,
  bidsByItem,
}: {
  org: { id: string; name: string };
  auctions: Auction[];
  itemsByAuction: Record<string, AuctionItem[]>;
  bidsByItem: Record<string, BidEntry[]>;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAuctionId, setDrawerAuctionId] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  function openDrawer(auctionId: string) {
    setDrawerAuctionId(auctionId);
    setDrawerOpen(true);
  }

  function toggleBids(itemId: string) {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId));
  }

  const allItems = Object.values(itemsByAuction).flat();
  const activeAndCompletedAuctionIds = new Set(
    auctions.filter((a) => a.status !== "draft").map((a) => a.id)
  );
  const totalRaised = allItems
    .filter((i) => activeAndCompletedAuctionIds.has(i.auctionId))
    .reduce((sum, i) => sum + i.currentBid, 0);
  const totalBids = allItems.reduce((sum, i) => sum + i.bidsCount, 0);
  const activeAuctionCount = auctions.filter(
    (a) => a.status === "active" || a.status === "ending_soon"
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <NewAuctionDrawer
        open={drawerOpen}
        auctionId={drawerAuctionId}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Top nav bar */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              {org.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Organization</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {org.name}
              </p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Auctions
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your organization&apos;s auctions and their items.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Raised", value: `$${(totalRaised / 100).toLocaleString()}`, sub: "across all active items" },
            { label: "Active Auctions", value: activeAuctionCount, sub: `${auctions.length} total` },
            { label: "Total Bids", value: totalBids, sub: "across all items" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Auction list */}
        <div className="space-y-6">
          {auctions.map((auction) => {
            const items = itemsByAuction[auction.id] ?? [];
            const time = timeRemaining(auction.endsAt);
            const cfg = auctionStatusConfig[auction.status];
            const isCompleted = auction.status === "completed";

            return (
              <div key={auction.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                {/* Auction header */}
                <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cfg.className}`}>
                      {cfg.label}
                    </span>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {auction.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">Ends</p>
                      <p className={`text-xs font-medium ${time.urgent ? "text-red-500 dark:text-red-400" : "text-zinc-600 dark:text-zinc-300"}`}>
                        {time.label}
                      </p>
                    </div>
                    <button
                      onClick={() => openDrawer(auction.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
                      </svg>
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Items table */}
                <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-800">
                  <thead>
                    <tr>
                      <th className="py-2.5 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                        Item
                      </th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                        Current Bid
                      </th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                        Bids
                      </th>
                      <th className="py-2.5 pl-3 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {items.map((item) => {
                      const itemBids = bidsByItem[item.id] ?? [];
                      const isExpanded = expandedItemId === item.id;

                      return (
                        <Fragment key={item.id}>
                          <tr
                            className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 ${isCompleted ? "opacity-60" : ""}`}
                          >
                            <td className="py-3.5 pl-6 pr-3">
                              <div className="flex items-center gap-3">
                                {item.imageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 flex-shrink-0 rounded-md bg-zinc-100 dark:bg-zinc-800" />
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    {item.title}
                                  </p>
                                  <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500 line-clamp-1 max-w-xs">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-right">
                              <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                                ${(item.currentBid / 100).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-3 py-3.5 text-right">
                              <span className="text-sm tabular-nums text-zinc-600 dark:text-zinc-400">
                                {item.bidsCount}
                              </span>
                            </td>
                            <td className="py-3.5 pl-3 pr-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!isCompleted && (
                                  <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
                                    Edit
                                  </button>
                                )}
                                {item.bidsCount > 0 && (
                                  <button
                                    onClick={() => toggleBids(item.id)}
                                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                      isExpanded
                                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                                    }`}
                                  >
                                    {isExpanded ? "Hide Bids" : "View Bids"}
                                    <svg
                                      className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                      viewBox="0 0 16 16"
                                      fill="currentColor"
                                    >
                                      <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Expandable bids list */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={4} className="border-t border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/30">
                                <div className="space-y-1">
                                  {itemBids.map((bid, idx) => (
                                    <div
                                      key={bid.id}
                                      className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                          {bid.bidderName}
                                        </span>
                                        {idx === 0 && (
                                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                                            Highest
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                          {formatBidTime(bid.createdAt)}
                                        </span>
                                        <span className="min-w-[4rem] text-right text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                                          ${(bid.amount / 100).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>

                {items.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm text-zinc-400 dark:text-zinc-500">
                      No items yet.{" "}
                      <button
                        onClick={() => openDrawer(auction.id)}
                        className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        Add the first one.
                      </button>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
