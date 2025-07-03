"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrayerTimesWidget } from "@/components/prayer-times-widget";
import { MasjidDiscovery } from "@/components/masjid-discovery";
import { UpcomingEvents } from "@/components/upcoming-events";
import { ChurchIcon as Mosque, Calendar, Bell, Heart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { CarouselDemo } from "@/components/carousel";

const dashboardCards = [
  {
    icon: <Mosque size={24} />,
    title: "Masjid Profiles",
    description: "Discover and connect with masjids in your area",
    link: "/dashboard/masjids",
    buttonText: "Explore Masjids",
  },
  {
    icon: <Bell size={24} />,
    title: "Azan System",
    description: "Customize your azan notifications and preferences",
    link: "/dashboard/azan-settings",
    buttonText: "Azan Settings",
  },
  {
    icon: <Calendar size={24} />,
    title: "Events",
    description: "Stay updated with community events and gatherings",
    link: "/dashboard/events",
    buttonText: "View Events",
  },
  {
    icon: <Heart size={24} />,
    title: "Donations",
    description: "Support your local masjid with secure donations",
    link: "/dashboard/donate",
    buttonText: "Donate Now",
  },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const fullName = user?.displayName;

  return (
    <div className="space-y-7">
      <h1 className="text-xl">Welcome {fullName}</h1>
      <PrayerTimesWidget />
      <div className="mx-10 sm:hidden">
        <CarouselDemo />
      </div>
      <div className="hidden sm:grid grid-cols-4 gap-2 md:grid-cols-2 lg:grid-cols-4 md:gap-4 mt-5">
        {dashboardCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="space-y-1 p-3 md:p-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                {card.icon}
              </div>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link href={card.link}>{card.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <MasjidDiscovery />
        </div>
        <div>
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
