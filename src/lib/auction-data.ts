export type Bid = {
  id: string;
  bidderName: string;
  amount: number;
  timestamp: string;
};

export type AuctionItem = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  currentBid: number;
  totalBids: number;
  bids: Bid[];
};

export type Auction = {
  id: string;
  title: string;
  organization: string;
  endsAt: string;
  isLive: boolean;
};
