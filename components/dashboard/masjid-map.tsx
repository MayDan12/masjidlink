"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, Search } from "lucide-react";

export function MasjidMap() {
  // const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative">
      <div className="h-[500px] bg-muted flex items-center justify-center">
        {/* This would be replaced with an actual map component like Google Maps or Mapbox */}
        <div className="text-center p-4">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Map would be displayed here</p>
          <p className="text-sm text-muted-foreground mt-2">
            Using Google Maps or Mapbox integration
          </p>
        </div>
      </div>

      <div className="absolute top-4 left-4 right-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search for masjids..."
            className="w-full h-10 pl-8 pr-4 rounded-md border bg-background"
          />
        </div>
        <Button variant="default" size="icon" className="h-10 w-10">
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm">Masjid</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Islamic Center</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Prayer Space</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
