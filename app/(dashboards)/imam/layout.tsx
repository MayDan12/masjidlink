import type React from "react";
import type { Metadata } from "next";
import { UnifiedSidebar } from "@/components/dashboardSidebar";
import UserIcon from "@/components/user-icon";
import CompleteProfilePopup from "@/components/completeProfilePopup";

export const metadata: Metadata = {
  title: "Imam Dashboard - MasjidLink",
  description: "Manage your masjid profile, events, and donations",
};

export default function ImamDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex  min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72">
        <UnifiedSidebar role="imam" />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <CompleteProfilePopup />
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="md:hidden">
            <UnifiedSidebar role="imam" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <UserIcon
                links={[
                  {
                    link: "/imam/profile",
                    title: "Profile",
                  },
                  {
                    link: "/imam/settings",
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
