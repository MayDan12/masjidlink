"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChurchIcon as Mosque,
  LayoutDashboard,
  Users,
  Flag,
  Settings,
  Shield,
  BarChart,
  MessageSquare,
  LogOut,
  Bell,
} from "lucide-react";

export function AdminDashboardSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin-dashboard",
      variant: "default",
    },
    {
      title: "Masjid Verification",
      icon: Mosque,
      href: "/admin-dashboard/masjids",
      variant: "ghost",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/admin-dashboard/users",
      variant: "ghost",
    },
    {
      title: "Content Moderation",
      icon: Flag,
      href: "/admin-dashboard/moderation",
      variant: "ghost",
    },
    {
      title: "Announcements",
      icon: Bell,
      href: "/admin-dashboard/announcements",
      variant: "ghost",
    },
    {
      title: "Message Center",
      icon: MessageSquare,
      href: "/admin-dashboard/messages",
      variant: "ghost",
    },
    {
      title: "Analytics",
      icon: BarChart,
      href: "/admin-dashboard/analytics",
      variant: "ghost",
    },
    {
      title: "Platform Settings",
      icon: Settings,
      href: "/admin-dashboard/settings",
      variant: "ghost",
    },
    {
      title: "Admin Access",
      icon: Shield,
      href: "/admin-dashboard/access",
      variant: "ghost",
    },
  ];

  return (
    <div className="relative hidden h-screen w-72 flex-col bg-background md:flex border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/admin-dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Shield className="h-6 w-6 text-primary" />
          <span>Admin Dashboard</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-2 px-4">
          {routes.map((route, i) => (
            <Button
              key={i}
              variant={pathname === route.href ? "default" : "ghost"}
              className={cn(
                "justify-start gap-2",
                pathname === route.href && "bg-primary text-primary-foreground"
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-5 w-5" />
                {route.title}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          asChild
        >
          <Link href="/">
            <LogOut className="h-5 w-5" />
            Exit Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
