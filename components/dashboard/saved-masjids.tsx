"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, Clock, ExternalLink } from "lucide-react";

type SavedMasjid = {
  id: string;
  name: string;
  address: string;
  nextPrayer: string;
  nextPrayerTime: string;
  image?: string;
};

export function SavedMasjids() {
  const [savedMasjids, setSavedMasjids] = useState<SavedMasjid[]>([
    {
      id: "1",
      name: "Masjid Al-Noor",
      address: "123 Main St, Chicago, IL",
      nextPrayer: "Asr",
      nextPrayerTime: "3:45 PM",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Islamic Center of Chicago",
      address: "456 Oak Ave, Chicago, IL",
      nextPrayer: "Asr",
      nextPrayerTime: "3:50 PM",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]);

  const removeSavedMasjid = (id: string) => {
    setSavedMasjids(savedMasjids.filter((masjid) => masjid.id !== id));
  };

  return (
    <div className="space-y-4">
      {savedMasjids.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {savedMasjids.map((masjid) => (
              <Card key={masjid.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={masjid.image || "/placeholder.svg"}
                        alt={masjid.name}
                      />
                      <AvatarFallback>
                        {masjid.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{masjid.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => removeSavedMasjid(masjid.id)}
                        >
                          <Heart className="h-4 w-4 fill-red-500" />
                          <span className="sr-only">Remove from favorites</span>
                        </Button>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">{masjid.address}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center text-sm">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {masjid.nextPrayer} {masjid.nextPrayerTime}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1 h-7">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>View</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline">Find More Masjids</Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Saved Masjids</h3>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t saved any masjids yet. Save your favorite masjids
            to quickly access their information.
          </p>
          <Button>Discover Masjids</Button>
        </div>
      )}
    </div>
  );
}
