"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChurchIcon as Mosque,
  Clock,
  Calendar,
  Bell,
  Heart,
  Settings,
  Users,
  AlertTriangle,
  Home,
  User,
} from "lucide-react";
import Logout from "./auth/logout-button";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainNavItems = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Prayer Times",
      href: "/dashboard/prayer-times",
      icon: Clock,
    },
    {
      title: "Masjids",
      href: "/dashboard/masjids",
      icon: Mosque,
    },
    {
      title: "Events",
      href: "/dashboard/events",
      icon: Calendar,
    },
    {
      title: "Azan Settings",
      href: "/dashboard/azan-settings",
      icon: Bell,
    },
    {
      title: "Donate",
      href: "/dashboard/donate",
      icon: Heart,
    },
    {
      title: "Community",
      href: "/dashboard/community",
      icon: Users,
    },
    {
      title: "Emergency Alerts",
      href: "/dashboard/emergency-alerts",
      icon: AlertTriangle,
    },
  ];

  const accountNavItems = [
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar className="px-4">
      <SidebarHeader className="flex h-16 items-center border-b px-4">
        <div className={cn("flex items-center", isCollapsed && "md:hidden")}>
          <Mosque className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold">MasjidLink</span>
        </div>
        <div
          className={cn(
            "hidden",
            isCollapsed && "md:flex md:justify-center md:w-full"
          )}
        >
          <Mosque className="h-6 w-6 text-primary" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={isCollapsed ? item.title : undefined}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="h-5 w-5" />
                  <span className={cn("ml-2", isCollapsed && "md:hidden")}>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {accountNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={isCollapsed ? item.title : undefined}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="h-5 w-5" />
                  <span className={cn("ml-2", isCollapsed && "md:hidden")}>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <Logout>Exit dashboard</Logout>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
