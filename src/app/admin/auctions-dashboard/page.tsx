import { getCurrentOrg, getAuctionsByOrg, type Auction } from "@/lib/auctions";

function timeRemaining(endsAt: Date): string {
  const ms = endsAt.getTime() - Date.now();
  if (ms <= 0) return "Ended";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const statusConfig: Record<
  Auction["status"],
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className:
      "bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-600/20",
  },
  active: {
    label: "Active",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  },
  ending_soon: {
    label: "Ending Soon",
    className:
      "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  },
  closed: {
    label: "Closed",
    className:
      "bg-zinc-100 text-zinc-500 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700/20",
  },
};

export default function AuctionsDashboardPage() {
  const org = getCurrentOrg();
  const auctions = getAuctionsByOrg(org.id);

  const totalRaised = auctions
    .filter((a) => a.status !== "draft")
    .reduce((sum, a) => sum + a.currentBid, 0);
  const totalBids = auctions.reduce((sum, a) => sum + a.bidsCount, 0);
  const activeCount = auctions.filter(
    (a) => a.status === "active" || a.status === "ending_soon"
  ).length;

  const statusOrder: Record<Auction["status"], number> = {
    ending_soon: 0,
    active: 1,
    draft: 2,
    closed: 3,
  };
  const sorted = [...auctions].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
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
          <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
            </svg>
            New Auction
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Auctions
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage all auctions running under your organization.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Raised",
              value: `$${totalRaised.toLocaleString()}`,
              sub: "across all active items",
            },
            {
              label: "Active Auctions",
              value: activeCount,
              sub: `${auctions.length} total`,
            },
            {
              label: "Total Bids",
              value: totalBids,
              sub: "across all items",
            },
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
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Auction table */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Item
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Status
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Current Bid
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Bids
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Ends
                </th>
                <th className="py-3 pl-3 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {sorted.map((auction) => {
                const cfg = statusConfig[auction.status];
                const isClosed = auction.status === "closed";
                const isDraft = auction.status === "draft";
                const isEndingSoon = auction.status === "ending_soon";
                const time = timeRemaining(auction.endsAt);

                return (
                  <tr
                    key={auction.id}
                    className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 ${
                      isClosed ? "opacity-50" : ""
                    }`}
                  >
                    <td className="py-4 pl-6 pr-3">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {auction.title}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500 line-clamp-1 max-w-xs">
                        {auction.description}
                      </p>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cfg.className}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right">
                      {isDraft ? (
                        <span className="text-sm text-zinc-400">—</span>
                      ) : (
                        <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                          ${auction.currentBid.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-right">
                      <span className="text-sm tabular-nums text-zinc-600 dark:text-zinc-400">
                        {isDraft ? "—" : auction.bidsCount}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      {isClosed ? (
                        <span className="text-xs text-zinc-400">Ended</span>
                      ) : isDraft ? (
                        <span className="text-xs text-zinc-400">Not scheduled</span>
                      ) : (
                        <span
                          className={`text-xs font-medium ${
                            isEndingSoon
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {time}
                        </span>
                      )}
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isClosed && (
                          <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
                            Edit
                          </button>
                        )}
                        {(auction.status === "active" ||
                          auction.status === "ending_soon") && (
                          <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
                            View Bids
                          </button>
                        )}
                        {isDraft && (
                          <button className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20">
                            Publish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {auctions.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                No auctions yet.{" "}
                <button className="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
                  Create your first one.
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
