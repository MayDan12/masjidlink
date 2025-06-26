import type React from "react";
import type { Metadata } from "next";
import UserIcon from "@/components/user-icon";
import { UnifiedSidebar } from "@/components/dashboardSidebar";
import PlanPopup from "@/components/popup";

export const metadata: Metadata = {
  title: "MasjidLink - Muslim Lifestyle App",
  description:
    "Connect with your local masjid, track prayer times, and strengthen bonds within the Ummah",
};

export default function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex  min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72">
        <UnifiedSidebar role="user" />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <PlanPopup />
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="md:hidden">
            <UnifiedSidebar role="user" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <UserIcon
                links={[
                  {
                    link: "/dashboard/profile",
                    title: "Profile",
                  },
                  {
                    link: "/dashboard/settings",
                    title: "Settings",
                  },
                ]}
              />
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
