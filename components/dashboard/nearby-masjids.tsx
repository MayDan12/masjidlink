"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Navigation, Clock, Heart } from "lucide-react";
import { getAllMasjids } from "@/app/(dashboards)/dashboard/masjids/action";
import { Masjid } from "@/types/masjid";
import { Skeleton } from "../ui/skeleton";

export function NearbyMasjids() {
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllMasjids = async () => {
      setLoading(true);
      try {
        const response = await getAllMasjids();
        if (response.success) {
          setMasjids(response.data);
        } else {
          console.error("Failed to fetch masjids:", response.message);
        }
      } catch (error) {
        console.error("Error fetching masjids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMasjids();
  }, []);

  const toggleFavorite = (id: string) => {
    setMasjids(
      masjids.map((masjid) =>
        masjid.id === id
          ? { ...masjid, isFavorite: !masjid.isFavorite }
          : masjid,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row justify-between items-center">
        <Button variant="outline" size="sm" className="gap-1">
          <Navigation className="h-4 w-4" />
          Update Location
        </Button>
        <span className="text-sm text-muted-foreground">
          Showing masjids near Chicago, IL
        </span>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      ) : (
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
                        {masjid.country || "N/A"}
                        {/* {masjid.prayerTimes?.nextPrayer || "N/A"} */}
                      </Badge>
                      <span className="text-sm">
                        {/* {masjid.distance || "N/A"} */}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center">
        <Button variant="link">View All Nearby Masjids</Button>
      </div>
    </div>
  );
}
