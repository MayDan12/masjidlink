import type React from "react";
import type { Metadata } from "next";
import Header from "@/components/landing/header";

export const metadata: Metadata = {
  title: "MasjidLink - Muslim Lifestyle App",
  description:
    "Connect with your local masjid, track prayer times, and strengthen bonds within the Ummah",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}
