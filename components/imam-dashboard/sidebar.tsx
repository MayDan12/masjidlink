"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChurchIcon as Mosque,
  LayoutDashboard,
  Calendar,
  DollarSign,
  Clock,
  Bell,
  Settings,
  Users,
  AlertTriangle,
  FileEdit,
  LogOut,
} from "lucide-react";

export function ImamDashboardSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/imam-dashboard",
      variant: "default",
    },
    {
      title: "Masjid Profile",
      icon: Mosque,
      href: "/imam-dashboard/profile",
      variant: "ghost",
    },
    {
      title: "Prayer Times",
      icon: Clock,
      href: "/imam-dashboard/prayer-times",
      variant: "ghost",
    },
    {
      title: "Events",
      icon: Calendar,
      href: "/imam-dashboard/events",
      variant: "ghost",
    },
    {
      title: "Donations",
      icon: DollarSign,
      href: "/imam-dashboard/donations",
      variant: "ghost",
    },
    {
      title: "Announcements",
      icon: Bell,
      href: "/imam-dashboard/announcements",
      variant: "ghost",
    },
    {
      title: "Emergency Alerts",
      icon: AlertTriangle,
      href: "/imam-dashboard/alerts",
      variant: "ghost",
    },
    {
      title: "Khutbah Archive",
      icon: FileEdit,
      href: "/imam-dashboard/khutbah",
      variant: "ghost",
    },
    {
      title: "Community",
      icon: Users,
      href: "/imam-dashboard/community",
      variant: "ghost",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/imam-dashboard/settings",
      variant: "ghost",
    },
  ];

  return (
    <div className="relative hidden h-screen w-72 flex-col bg-background md:flex border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/imam-dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Mosque className="h-6 w-6 text-primary" />
          <span>Imam Dashboard</span>
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
