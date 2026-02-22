import Link from "next/link";
import Image from "next/image";
import { MOCK_AUCTIONS } from "@/lib/auction-data";

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AuctionsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <GavelIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-foreground">BidWell</span>
          </Link>
        </div>
      </header>

      {/* Back link and page title */}
      <div className="max-w-5xl mx-auto px-5 pt-6 pb-2">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-5 pt-4 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Live Auctions</h1>
        <p className="mt-1 text-muted-foreground">Browse current silent auctions and find items to bid on.</p>
      </div>

      {/* Auction Cards */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <div className="flex flex-col gap-4">
          {MOCK_AUCTIONS.map((auction) => (
            <Link
              key={auction.id}
              href={`/auctions/${auction.id}`}
              className="group bg-card border border-border rounded-xl overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                  <Image
                    src={auction.coverImage}
                    alt={auction.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                  {auction.isLive && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                      Live
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">{auction.organization}</p>
                    <h2 className="mt-1 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{auction.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{auction.description}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-mono">{auction.itemCount} items</span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5" />
                      Ends {formatDate(auction.endsAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
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
    </main>
  );
}
