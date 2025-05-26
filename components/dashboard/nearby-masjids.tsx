"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Navigation, Clock, Heart } from "lucide-react";

type Masjid = {
  id: string;
  name: string;
  distance: string;
  address: string;
  nextPrayer: string;
  nextPrayerTime: string;
  isFavorite: boolean;
  image?: string;
};

export function NearbyMasjids() {
  const [masjids, setMasjids] = useState<Masjid[]>([
    {
      id: "1",
      name: "Masjid Al-Noor",
      distance: "0.8 miles",
      address: "123 Main St, Chicago, IL",
      nextPrayer: "Asr",
      nextPrayerTime: "3:45 PM",
      isFavorite: true,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Islamic Center of Chicago",
      distance: "1.2 miles",
      address: "456 Oak Ave, Chicago, IL",
      nextPrayer: "Asr",
      nextPrayerTime: "3:50 PM",
      isFavorite: false,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Masjid Al-Rahman",
      distance: "2.5 miles",
      address: "789 Elm St, Chicago, IL",
      nextPrayer: "Asr",
      nextPrayerTime: "4:00 PM",
      isFavorite: false,
      image: "/placeholder.svg?height=40&width=40",
    },
  ]);

  const toggleFavorite = (id: string) => {
    setMasjids(
      masjids.map((masjid) =>
        masjid.id === id
          ? { ...masjid, isFavorite: !masjid.isFavorite }
          : masjid
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" className="gap-1">
          <Navigation className="h-4 w-4" />
          Update Location
        </Button>
        <span className="text-sm text-muted-foreground">
          Showing masjids near Chicago, IL
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {masjids.map((masjid) => (
          <Card key={masjid.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={masjid.image || "/placeholder.svg"}
                    alt={masjid.name}
                  />
                  <AvatarFallback>{masjid.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{masjid.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => toggleFavorite(masjid.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          masjid.isFavorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      <span className="sr-only">
                        {masjid.isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"}
                      </span>
                    </Button>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{masjid.address}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {masjid.nextPrayer} {masjid.nextPrayerTime}
                    </Badge>
                    <span className="text-sm">{masjid.distance}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="link">View All Nearby Masjids</Button>
      </div>
    </div>
  );
}
