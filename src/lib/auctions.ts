export type Organization = {
  id: string;
  slug: string;
  name: string;
};

export type Auction = {
  id: string;
  orgId: string;
  title: string;
  description: string;
  currentBid: number;
  startingBid: number;
  endsAt: Date;
  bidsCount: number;
  status: "draft" | "active" | "ending_soon" | "closed";
};

export const mockOrgs: Organization[] = [
  { id: "org_1", slug: "riverdale-foundation", name: "Riverdale Community Foundation" },
  { id: "org_2", slug: "westside-school", name: "Westside Elementary PTA" },
];

export const mockAuctions: Auction[] = [
  {
    id: "1",
    orgId: "org_1",
    title: "Signed Michael Jordan Jersey",
    description: "Authentic 1996 Chicago Bulls jersey signed by MJ himself. Comes with certificate of authenticity.",
    currentBid: 1250,
    startingBid: 500,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    bidsCount: 14,
    status: "active",
  },
  {
    id: "2",
    orgId: "org_1",
    title: "Weekend Getaway – Napa Valley",
    description: "Two nights for two at a boutique vineyard hotel. Includes wine tasting and private tour.",
    currentBid: 875,
    startingBid: 400,
    endsAt: new Date(Date.now() + 1000 * 60 * 90),
    bidsCount: 9,
    status: "ending_soon",
  },
  {
    id: "3",
    orgId: "org_1",
    title: "Custom Oil Portrait",
    description: "Commission a 24\"x36\" oil painting by local artist Dana Reeves. 6–8 week turnaround.",
    currentBid: 320,
    startingBid: 200,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72),
    bidsCount: 5,
    status: "active",
  },
  {
    id: "4",
    orgId: "org_1",
    title: "Chef's Table for 6",
    description: "Private dining experience at Maison Rouge. 7-course tasting menu with wine pairings.",
    currentBid: 600,
    startingBid: 600,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 120),
    bidsCount: 1,
    status: "draft",
  },
  {
    id: "5",
    orgId: "org_1",
    title: "Apple Vision Pro",
    description: "Brand new, unopened Apple Vision Pro (256GB). Donated by TechForGood sponsors.",
    currentBid: 2100,
    startingBid: 1500,
    endsAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    bidsCount: 22,
    status: "closed",
  },
  {
    id: "6",
    orgId: "org_2",
    title: "Principal for a Day",
    description: "One lucky student gets to be principal for the day. Includes reserved parking and morning announcements.",
    currentBid: 150,
    startingBid: 50,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 36),
    bidsCount: 7,
    status: "active",
  },
];

export function getOrgBySlug(slug: string): Organization | undefined {
  return mockOrgs.find((o) => o.slug === slug);
}

export function getAuctionsByOrg(orgId: string): Auction[] {
  return mockAuctions.filter((a) => a.orgId === orgId);
}

// Placeholder for session-based org lookup — replace with real auth later
export function getCurrentOrg(): Organization {
  return mockOrgs[0];
}
