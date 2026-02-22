export type Organization = {
  id: string;
  slug: string;
  name: string;
};

export type Auction = {
  id: string;
  orgId: string;
  name: string;
  description: string;
  endsAt: Date;
  status: "draft" | "active" | "completed";
};

export type AuctionItem = {
  id: string;
  auctionId: string;
  title: string;
  description: string;
  imageUrl: string | null;
  currentBid: number;
  startingBid: number;
  bidsCount: number;
};

export const mockOrgs: Organization[] = [
  { id: "org_1", slug: "riverdale-foundation", name: "Riverdale Community Foundation" },
  { id: "org_2", slug: "westside-school", name: "Westside Elementary PTA" },
];

export const mockAuctions: Auction[] = [
  {
    id: "auction_1",
    orgId: "org_1",
    name: "Spring Gala 2026",
    description: "Annual fundraising gala for the Riverdale Community Foundation.",
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    status: "active",
  },
  {
    id: "auction_2",
    orgId: "org_2",
    name: "Spring Carnival Fundraiser",
    description: "Westside Elementary PTA spring carnival silent auction.",
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 36),
    status: "active",
  },
];

export const mockAuctionItems: AuctionItem[] = [
  {
    id: "item_1",
    auctionId: "auction_1",
    title: "Signed Michael Jordan Jersey",
    description: "Authentic 1996 Chicago Bulls jersey signed by MJ himself.",
    currentBid: 1250,
    startingBid: 500,
    imageUrl: null,
    bidsCount: 14,
  },
  {
    id: "item_2",
    auctionId: "auction_1",
    title: "Weekend Getaway – Napa Valley",
    description: "Two nights for two at a boutique vineyard hotel. Includes wine tasting and private tour.",
    currentBid: 875,
    startingBid: 400,
    imageUrl: null,
    bidsCount: 9,
  },
  {
    id: "item_3",
    auctionId: "auction_1",
    title: "Custom Oil Portrait",
    description: "Commission a 24\"x36\" oil painting by local artist Dana Reeves.",
    currentBid: 320,
    startingBid: 200,
    imageUrl: null,
    bidsCount: 5,
  },
  {
    id: "item_4",
    auctionId: "auction_1",
    title: "Chef's Table for 6",
    description: "Private dining experience at Maison Rouge. 7-course tasting menu with wine pairings.",
    currentBid: 600,
    startingBid: 600,
    imageUrl: null,
    bidsCount: 1,
  },
  {
    id: "item_5",
    auctionId: "auction_1",
    title: "Apple Vision Pro",
    description: "Brand new, unopened Apple Vision Pro (256GB). Donated by TechForGood sponsors.",
    currentBid: 2100,
    startingBid: 1500,
    imageUrl: null,
    bidsCount: 22,
  },
  {
    id: "item_6",
    auctionId: "auction_2",
    title: "Principal for a Day",
    description: "One lucky student gets to be principal for the day.",
    currentBid: 150,
    startingBid: 50,
    imageUrl: null,
    bidsCount: 7,
  },
];

export function getOrgBySlug(slug: string): Organization | undefined {
  return mockOrgs.find((o) => o.slug === slug);
}

export function getAuctionsByOrg(orgId: string): Auction[] {
  return mockAuctions.filter((a) => a.orgId === orgId);
}

export function getItemsByAuction(auctionId: string): AuctionItem[] {
  return mockAuctionItems.filter((i) => i.auctionId === auctionId);
}

// Placeholder for session-based org lookup — replace with real auth later
export function getCurrentOrg(): Organization {
  return mockOrgs[0];
}
