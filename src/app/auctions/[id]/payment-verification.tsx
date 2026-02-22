"use client";

import { useState, useRef, useEffect } from "react";
import { useBidder } from "@/lib/bidder-context";

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }
  return digits;
}

export default function PaymentVerification({ onClose }: { onClose: () => void }) {
  const { setVerified } = useBidder();
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [agreed, setAgreed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const isFormValid =
    name.trim().length > 1 &&
    email.includes("@") &&
    cardNumber.replace(/\s/g, "").length >= 15 &&
    expiry.length >= 4 &&
    cvc.length >= 3 &&
    agreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStep("processing");

    // Simulate payment processing
    setTimeout(() => {
      setStep("success");
      setVerified(name);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Payment verification"
    >
      <div
        ref={dialogRef}
        className="bg-card border border-border rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Verify to Bid</h2>
              <p className="text-xs text-muted-foreground">$1 refundable deposit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-5">
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              To prevent fraudulent bids, we require a small $1 refundable hold on your
              card. This verifies your identity and unlocks bidding on all items in
              this auction. You will only be charged if you win.
            </p>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="text-xs font-medium text-foreground uppercase tracking-wide mb-1.5 block">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="text-xs font-medium text-foreground uppercase tracking-wide mb-1.5 block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <label htmlFor="card" className="text-xs font-medium text-foreground uppercase tracking-wide mb-1.5 block">
                  Card Number
                </label>
                <input
                  id="card"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  inputMode="numeric"
                  maxLength={19}
                  required
                />
              </div>

              {/* Expiry & CVC */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="expiry" className="text-xs font-medium text-foreground uppercase tracking-wide mb-1.5 block">
                    Expiry
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    inputMode="numeric"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="cvc" className="text-xs font-medium text-foreground uppercase tracking-wide mb-1.5 block">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    inputMode="numeric"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to a $1 refundable hold on my card to verify my identity and
                  ability to pay. I understand I will only be charged the winning bid
                  amount if I win an item.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="mt-5 w-full bg-primary text-primary-foreground font-medium text-sm py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LockIcon className="h-4 w-4" />
              Authorize $1 Deposit
            </button>

            <p className="mt-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <LockIcon className="h-3 w-3" />
              Secured with 256-bit encryption
            </p>
          </form>
        )}

        {step === "processing" && (
          <div className="p-10 flex flex-col items-center justify-center gap-4">
            <SpinnerIcon className="h-10 w-10 text-primary" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Processing verification...</p>
              <p className="text-sm text-muted-foreground mt-1">Authorizing your $1 deposit</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-10 flex flex-col items-center justify-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Verification Complete</p>
              <p className="text-sm text-muted-foreground mt-1">You can now bid on any item in this auction</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
