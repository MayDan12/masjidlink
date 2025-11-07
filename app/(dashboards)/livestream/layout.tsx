"use client";
import type React from "react";

import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
export default function AllDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <StreamVideoProvider>
        <Elements stripe={stripePromise}>
          <main>{children}</main>
        </Elements>
      </StreamVideoProvider>
    </div>
  );
}
