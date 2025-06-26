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

// components/PlanPopup.tsx
import { useEffect, useState } from "react";

function PlanPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showPopup = () => {
      setVisible(true);
      // Hide after 15 seconds (optional)
      setTimeout(() => setVisible(false), 15000);
    };

    // Show on initial mount
    showPopup();

    // Show again every 10 minutes (600,000 ms)
    const interval = setInterval(() => {
      showPopup();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
        <p className="text-gray-700 mb-4">
          You're currently on the <strong>great</strong> plan.
        </p>
        <button
          onClick={() => setVisible(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const fullName = user?.displayName;

  return (
    <div className="space-y-7">
      <PlanPopup />
      <h1 className="text-xl">Welcome {fullName}</h1>

      <PrayerTimesWidget />

      <div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-4 md:gap-4 mt-5">
        <Card>
          <CardHeader className="space-y-1 p-3 md:p-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
              <Mosque size={24} />
            </div>
            <CardTitle>Masjid Profiles</CardTitle>
            <CardDescription>
              Discover and connect with masjids in your area
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/masjids">Explore Masjids</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1 p-3 md:p-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
              <Bell size={24} />
            </div>
            <CardTitle>Azan System</CardTitle>
            <CardDescription>
              Customize your azan notifications and preferences
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/azan-settings">Azan Settings</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1 p-3 md:p-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
              <Calendar size={24} />
            </div>
            <CardTitle>Events</CardTitle>
            <CardDescription>
              Stay updated with community events and gatherings
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/events">View Events</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1 p-3 md:p-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
              <Heart size={24} />
            </div>
            <CardTitle>Donations</CardTitle>
            <CardDescription>
              Support your local masjid with secure donations
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/donate">Donate Now</Link>
            </Button>
          </CardFooter>
        </Card>
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
