"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { AuctionItem } from "@/lib/auction-data";

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`} aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
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

export default function BidModal({
  item,
  onClose,
  onSubmit,
}: {
  item: AuctionItem;
  onClose: () => void;
  onSubmit: (itemId: string, amount: number) => void;
}) {
  const minBid = item.currentBid + 10;
  const [amount, setAmount] = useState(minBid.toString());
  const [step, setStep] = useState<"form" | "confirming" | "success">("form");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const numericAmount = parseInt(amount.replace(/\D/g, ""), 10) || 0;
  const isValid = numericAmount >= minBid;

  const quickBids = [
    minBid,
    minBid + 25,
    minBid + 50,
    minBid + 100,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStep("confirming");

    setTimeout(() => {
      setStep("success");
      onSubmit(item.id, numericAmount);
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Place a bid"
    >
      <div className="bg-card border border-border rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header with item preview */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            {item.image && (
              <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-semibold text-foreground text-sm truncate">{item.title}</h2>
              <p className="text-xs text-muted-foreground">
                Current bid: <span className="font-mono font-medium text-foreground">{formatCurrency(item.currentBid)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-5">
            <p className="text-sm text-muted-foreground mb-4">
              Minimum bid: <span className="font-mono font-medium text-foreground">{formatCurrency(minBid)}</span>
            </p>

            {/* Amount input */}
            <div className="mb-4">
              <label htmlFor="bid-amount" className="text-xs font-medium text-foreground uppercase tracking-wide mb-1.5 block">
                Your Bid
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-lg">$</span>
                <input
                  ref={inputRef}
                  id="bid-amount"
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full bg-background border border-input rounded-lg pl-8 pr-3 py-3 text-xl font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {!isValid && amount.length > 0 && (
                <p className="mt-1.5 text-xs text-destructive">
                  Bid must be at least {formatCurrency(minBid)}
                </p>
              )}
            </div>

            {/* Quick bid buttons */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {quickBids.map((qb) => (
                <button
                  key={qb}
                  type="button"
                  onClick={() => setAmount(qb.toString())}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                    numericAmount === qb
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {formatCurrency(qb)}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full bg-primary text-primary-foreground font-medium text-sm py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Bid of {formatCurrency(numericAmount)}
            </button>
          </form>
        )}

        {step === "confirming" && (
          <div className="p-10 flex flex-col items-center justify-center gap-4">
            <SpinnerIcon className="h-10 w-10 text-primary" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Placing your bid...</p>
              <p className="text-sm text-muted-foreground mt-1">{formatCurrency(numericAmount)} on {item.title}</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-10 flex flex-col items-center justify-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Bid Placed!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your bid of {formatCurrency(numericAmount)} is now the highest
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
