"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Menu,
  Shield,
  Flag,
  BarChart,
  MessageSquare,
  Home,
  User2,
  User,
  Heart,
} from "lucide-react";
import Logout from "./auth/logout-button";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { MosqueIcon } from "./icons/MosqueIcon";

type Route = {
  title: string;
  icon: LucideIcon | null;
  imageIcon?: string;
  href: string;
};

type SidebarProps = {
  role: "imam" | "admin" | "user";
};

export function UnifiedSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const imamRoutes: Route[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/imam",
    },
    {
      title: "Masjid Profile",
      icon: MosqueIcon,
      href: "/imam/profile",
    },
    {
      title: "Prayer Times",
      icon: Clock,
      href: "/imam/prayer-times",
    },
    {
      title: "Events",
      icon: Calendar,
      href: "/imam/events",
    },
    {
      title: "Donations",
      icon: Heart,
      href: "/imam/donations",
    },
    {
      title: "Payment",
      icon: DollarSign,
      href: "/imam/payment",
    },
    {
      title: "Announcements",
      icon: Bell,
      href: "/imam/announcements",
    },
    // {
    //   title: "Emergency Alerts",
    //   icon: AlertTriangle,
    //   href: "/imam/alerts",
    // },
    // {
    //   title: "Khutbah Archive",
    //   icon: FileEdit,
    //   href: "/imam/khutbah",
    // },
    {
      title: "Community",
      icon: Users,
      href: "/imam/community",
    },
    {
      title: "Profile",
      icon: User,
      href: "/imam/my-profile",
    },
    // {
    //   title: "Settings",
    //   icon: Settings,
    //   href: "/imam/settings",
    // },
  ];

  const adminRoutes: Route[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Masjid Verification",
      icon: Mosque,
      href: "/admin/masjids",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Content Moderation",
      icon: Flag,
      href: "/admin/moderation",
    },
    {
      title: "Announcements",
      icon: Bell,
      href: "/admin/announcements",
    },
    {
      title: "Message Center",
      icon: MessageSquare,
      href: "/admin/messages",
    },
    {
      title: "Analytics",
      icon: BarChart,
      href: "/admin/analytics",
    },
    {
      title: "Platform Settings",
      icon: Settings,
      href: "/admin/settings",
    },
    {
      title: "Admin Access",
      icon: Shield,
      href: "/admin/access",
    },
  ];

  const userRoutes: Route[] = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Profile",
      icon: User2,
      href: "/dashboard/profile",
    },
    {
      title: "Prayer Times",
      href: "/dashboard/prayer-times",
      icon: Clock,
    },
    {
      title: "Masjids",
      href: "/dashboard/masjids",
      icon: MosqueIcon,
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
    // {
    //   title: "Community",
    //   href: "/dashboard/community",
    //   icon: Users,
    // },
    {
      title: "Emergency Alerts",
      href: "/dashboard/emergency-alerts",
      icon: AlertTriangle,
    },
  ];

  let routes;
  let dashboardTitle;
  let dashboardPath;

  switch (role) {
    case "imam":
      routes = imamRoutes;
      dashboardTitle = "Imam Dashboard";
      dashboardPath = "/imam";

      break;
    case "admin":
      routes = adminRoutes;
      dashboardTitle = "Admin Dashboard";
      dashboardPath = "/admin";

      break;
    default:
      routes = userRoutes;
      dashboardTitle = "Dashboard";
      dashboardPath = "/";
      break;
  }

  // Only render the mobile trigger button when this component is rendered in the header
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="flex h-16 items-center border-b px-6">
            <Link
              href={dashboardPath}
              className="flex items-center gap-2 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              {/* {DashboardIcon && ( */}
              <Image
                src="/masjidlink.png"
                alt="masjidlink logo"
                width={30}
                height={30}
              />
              {/* )} */}
              <span>{dashboardTitle}</span>
            </Link>
          </div>
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex-1 overflow-y-auto py-4 px-4">
              <nav className="grid gap-2">
                {routes.map((route, i) => (
                  <Button
                    key={i}
                    variant={pathname === route.href ? "default" : "ghost"}
                    className={cn(
                      "justify-start gap-2",
                      pathname === route.href &&
                        "bg-primary text-primary-foreground",
                    )}
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={route.href}>
                      {route.icon ? (
                        <route.icon className="w-5 h-5" />
                      ) : (
                        <Image
                          src={route.imageIcon!}
                          alt={route.title}
                          className="w-5 h-5"
                          height={30}
                          width={30}
                          priority
                        />
                      )}
                      {route.title}
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
          </div>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              asChild
              onClick={() => setIsOpen(false)}
            >
              <Link href="/">
                <Home className="h-5 w-5" />
                Return to Home
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden md:flex z-30 h-screen w-72 flex-col bg-background border-r fixed ">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href={dashboardPath}
          className="flex items-center gap-2 font-semibold"
        >
          <Image
            src="/masjidlink.png"
            alt="masjidlink logo"
            width={35}
            height={35}
          />
          <span>{dashboardTitle}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-4">
        <nav className="grid gap-2">
          {routes.map((route, i) => (
            <Button
              key={i}
              variant={pathname === route.href ? "default" : "ghost"}
              className={cn(
                "justify-start gap-2",
                pathname === route.href && "bg-primary text-primary-foreground",
              )}
              asChild
            >
              <Link href={route.href}>
                {route.icon ? (
                  <route.icon className="w-5 h-5" />
                ) : (
                  <Image
                    src={route.imageIcon!}
                    alt={route.title}
                    className="w-5 h-5"
                    height={30}
                    width={30}
                    priority
                  />
                )}
                {route.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Logout>Exit Dashboard</Logout>
      </div>
    </div>
  );
}
