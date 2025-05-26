"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Compass, MapPin, RotateCw } from "lucide-react";

export function QiblaFinder() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findQiblaDirection = () => {
    setIsLoading(true);
    setError(null);

    // Simulate finding Qibla direction
    setTimeout(() => {
      // Mock calculation - in a real app, this would use geolocation and math to calculate
      setQiblaDirection(138);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    findQiblaDirection();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-48 mb-4">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <RotateCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : qiblaDirection !== null ? (
          <>
            <div className="absolute inset-0 border-4 border-muted rounded-full flex items-center justify-center">
              <Compass className="h-12 w-12 text-muted-foreground" />
            </div>
            <div
              className="absolute top-1/2 left-1/2 w-1 h-24 bg-primary -translate-x-1/2 -translate-y-1/2 origin-bottom rounded-t-full"
              style={{
                transform: `translate(-50%, -50%) rotate(${qiblaDirection}deg)`,
              }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2">
              <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Qibla
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Unable to determine Qibla direction
          </div>
        )}
      </div>

      {qiblaDirection !== null && (
        <div className="text-center mb-4">
          <p className="text-lg font-bold">{qiblaDirection}°</p>
          <p className="text-sm text-muted-foreground">from North</p>
        </div>
      )}

      {error && <div className="text-sm text-red-500 mb-4">{error}</div>}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={findQiblaDirection}
          disabled={isLoading}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm">
          <MapPin className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>
      </div>
    </div>
  );
}
