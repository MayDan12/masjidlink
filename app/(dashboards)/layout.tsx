import type React from "react";
import type { Metadata } from "next";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import PlanPopup from "@/components/popup";

export const metadata: Metadata = {
  title: "MasjidLink - Muslim Lifestyle App",
  description:
    "Connect with your local masjid, track prayer times, and strengthen bonds within the Ummah",
};

export default function AllDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <StreamVideoProvider>
        <main>
          <PlanPopup />
          {children}
        </main>
      </StreamVideoProvider>
    </div>
  );
}
