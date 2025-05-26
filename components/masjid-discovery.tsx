"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Heart } from "lucide-react";
import Link from "next/link";

type Masjid = {
  id: string;
  name: string;
  location: string;
  distance: string;
  image: string;
  followers: number;
  nextPrayer: string;
  nextPrayerTime: string;
};

export function MasjidDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for nearby masjids
  const nearbyMasjids: Masjid[] = [
    {
      id: "1",
      name: "Masjid Al-Noor",
      location: "123 Main St, City",
      distance: "0.5 miles",
      image: "/placeholder.svg?height=80&width=80",
      followers: 1250,
      nextPrayer: "Asr",
      nextPrayerTime: "3:45 PM",
    },
    {
      id: "2",
      name: "Islamic Center",
      location: "456 Oak Ave, City",
      distance: "1.2 miles",
      image: "/placeholder.svg?height=80&width=80",
      followers: 980,
      nextPrayer: "Asr",
      nextPrayerTime: "3:50 PM",
    },
    {
      id: "3",
      name: "Masjid Al-Rahma",
      location: "789 Elm St, City",
      distance: "2.3 miles",
      image: "/placeholder.svg?height=80&width=80",
      followers: 1540,
      nextPrayer: "Asr",
      nextPrayerTime: "3:55 PM",
    },
  ];

  // Mock data for popular masjids
  const popularMasjids: Masjid[] = [
    {
      id: "4",
      name: "Grand Mosque",
      location: "101 Central Ave, City",
      distance: "3.5 miles",
      image: "/placeholder.svg?height=80&width=80",
      followers: 5250,
      nextPrayer: "Asr",
      nextPrayerTime: "3:45 PM",
    },
    {
      id: "5",
      name: "Masjid Al-Taqwa",
      location: "202 Park Rd, City",
      distance: "4.8 miles",
      image: "/placeholder.svg?height=80&width=80",
      followers: 3980,
      nextPrayer: "Asr",
      nextPrayerTime: "3:50 PM",
    },
    {
      id: "6",
      name: "Islamic Foundation",
      location: "303 River Dr, City",
      distance: "5.1 miles",
      image: "/placeholder.svg?height=80&width=80",
      followers: 4540,
      nextPrayer: "Asr",
      nextPrayerTime: "3:55 PM",
    },
  ];

  // Filter masjids based on search query
  const filteredNearby = nearbyMasjids.filter(
    (masjid) =>
      masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      masjid.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPopular = popularMasjids.filter(
    (masjid) =>
      masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      masjid.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discover Masjids</CardTitle>
        <CardDescription>
          Find and connect with masjids in your area
        </CardDescription>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
          <Input
            type="text"
            placeholder="Search by name or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nearby">
          <TabsList className="mb-4">
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
          <TabsContent value="nearby">
            <div className="space-y-4">
              {filteredNearby.length > 0 ? (
                filteredNearby.map((masjid) => (
                  <MasjidCard key={masjid.id} masjid={masjid} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No nearby masjids found
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="popular">
            <div className="space-y-4">
              {filteredPopular.length > 0 ? (
                filteredPopular.map((masjid) => (
                  <MasjidCard key={masjid.id} masjid={masjid} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No popular masjids found
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MasjidCard({ masjid }: { masjid: Masjid }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg">
      <Avatar className="h-16 w-16">
        <AvatarImage
          src={masjid.image || "/placeholder.svg"}
          alt={masjid.name}
        />
        <AvatarFallback>{masjid.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{masjid.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{masjid.location}</span>
              <span className="mx-2">•</span>
              <span>{masjid.distance}</span>
            </div>
          </div>
          <Button
            variant={isFollowing ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsFollowing(!isFollowing)}
            className="flex items-center gap-1"
          >
            <Heart
              className="h-4 w-4"
              fill={isFollowing ? "currentColor" : "none"}
            />
            <span>{isFollowing ? "Following" : "Follow"}</span>
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {masjid.followers} followers
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {masjid.nextPrayer}: {masjid.nextPrayerTime}
            </Badge>
          </div>
          <Button variant="link" size="sm" asChild>
            <Link href={`/masjids/${masjid.id}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
