"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, Search } from "lucide-react";

export function MasjidMap() {
  // const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative">
      <div className="h-[500px] bg-muted items-center">
        {/* This would be replaced with an actual map component like Google Maps or Mapbox */}
        <div className="text-center p-4">
          {/* <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Map would be displayed here</p>

          <p className="text-sm text-muted-foreground mt-2">
            Using Google Maps or Mapbox integration
          </p> */}
          <div className="h-96 mt-12 bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d6122065.651254484!2d-132.6449429078125!3d37.39460349999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x808f7e8a54f9d273%3A0xaa7d6d15e89d301!2sSan%20Francisco%2C%20CA!3m2!1d37.7749295!2d-122.4194155!4m5!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!3m2!1d34.0522342!2d-118.2436849!5e0!3m2!1sen!2sus!4v1715695012!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
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
