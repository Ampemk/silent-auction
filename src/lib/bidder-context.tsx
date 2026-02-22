"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface BidderContextType {
  isVerified: boolean;
  bidderName: string;
  setVerified: (name: string) => void;
}

const BidderContext = createContext<BidderContextType>({
  isVerified: false,
  bidderName: "",
  setVerified: () => {},
});

export function BidderProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [bidderName, setBidderName] = useState("");

  const setVerified = (name: string) => {
    setIsVerified(true);
    setBidderName(name);
  };

  return (
    <BidderContext.Provider value={{ isVerified, bidderName, setVerified }}>
      {children}
    </BidderContext.Provider>
  );
}

export function useBidder() {
  return useContext(BidderContext);
}
