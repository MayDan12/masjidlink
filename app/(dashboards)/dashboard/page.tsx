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

export default function UserDashboard() {
  const { user } = useAuth();
  const fullName = user?.displayName;

  return (
    <div className="space-y-8">
      {/* <section className="py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4 font-amiri">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h1>
        <p className="text-3xl font-semibold mb-6">Welcome to MasjidLink</p>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Connect with your local masjid, track prayer times, and strengthen
          bonds within the Ummah
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/masjids">Find Masjids</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/prayers">Prayer Times</Link>
          </Button>
        </div>
      </section> */}
      <h1 className="text-2xl">Welcome {fullName}</h1>

      <PrayerTimesWidget />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <Card>
          <CardHeader className="space-y-1">
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
              <Link href="/masjids">Explore Masjids</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
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
              <Link href="/azan-settings">Azan Settings</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
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
              <Link href="/events">View Events</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
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
              <Link href="/donate">Donate Now</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
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
