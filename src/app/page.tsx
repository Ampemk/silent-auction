import Link from "next/link";

function GavelIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m14.5 12.5-8 8a2.12 2.12 0 1 1-3-3l8-8" />
      <path d="m16 16 6-6" />
      <path d="m8 8 6-6" />
      <path d="m9 7 8 8" />
      <path d="m21 11-8-8" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-3">
          <GavelIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            BidWell
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16">
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
            Silent Auctions Made Simple
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance leading-tight">
            Bid, win, and support causes that matter
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Whether you are hosting a fundraiser or looking for unique items to
            bid on, BidWell makes silent auctions seamless and transparent.
          </p>
        </div>
      </section>

      {/* Role Selection */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
          How would you like to get started?
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Bidder Card */}
          <Link
            href="/auctions"
            className="group flex-1 bg-card border border-border rounded-xl p-6 md:p-8 transition-all hover:border-primary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <SearchIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  Browse Auctions
                </h3>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  Discover live silent auctions, explore unique items, and place
                  your bids. A $1 verification deposit unlocks bidding for each
                  auction.
                </p>
                <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary">
                  Find auctions
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Host Card */}
          <div className="group flex-1 bg-card border border-border rounded-xl p-6 md:p-8 opacity-80 cursor-not-allowed">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                <BuildingIcon className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-foreground">
                  Host an Auction
                </h3>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  Create and manage silent auctions for your organization. Set
                  up items, track bids in real time, and manage your fundraiser
                  end-to-end.
                </p>
                <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-5 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            How Bidding Works
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Three simple steps to start placing bids on items you love.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            {[
              {
                step: "1",
                title: "Browse",
                desc: "Find a live auction and explore the gallery of items available for bidding.",
              },
              {
                step: "2",
                title: "Verify",
                desc: "Enter your payment info and authorize a $1 hold to confirm your identity.",
              },
              {
                step: "3",
                title: "Bid",
                desc: "Place bids on any item in the auction. You only pay if you win.",
              },
            ].map((item) => (
              <div key={item.step} className="flex-1 flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GavelIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">BidWell</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Trusted silent auction platform
          </p>
        </div>
      </footer>
    </main>
  );
}
