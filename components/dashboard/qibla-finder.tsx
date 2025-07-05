"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Compass, MapPin, RotateCw } from "lucide-react";
import Image from "next/image"; // ⬅️ Next.js image optimisation

export function QiblaFinder() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- STEP 1: Calculate static Qibla bearing ---------- */
  const findQiblaDirection = () => {
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const kaabaLat = 21.4225 * (Math.PI / 180);
        const kaabaLng = 39.8262 * (Math.PI / 180);
        const lat = coords.latitude * (Math.PI / 180);
        const lng = coords.longitude * (Math.PI / 180);
        const dLng = kaabaLng - lng;

        const bearing =
          (Math.atan2(
            Math.sin(dLng),
            Math.cos(lat) * Math.tan(kaabaLat) - Math.sin(lat) * Math.cos(dLng)
          ) *
            180) /
          Math.PI;

        setQiblaDirection((bearing + 360) % 360);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* ---------- STEP 2: Live compass heading ---------- */
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      if (typeof e.alpha === "number") setHeading(e.alpha);
    };

    if (window.DeviceOrientationEvent?.requestPermission) {
      window.DeviceOrientationEvent.requestPermission().then((res) => {
        if (res === "granted")
          window.addEventListener("deviceorientation", handler, true);
      });
    } else {
      window.addEventListener(
        "deviceorientationabsolute" in window
          ? "deviceorientationabsolute"
          : "deviceorientation",
        handler,
        true
      );
    }

    return () => window.removeEventListener("deviceorientation", handler, true);
  }, []);

  useEffect(findQiblaDirection, []);

  /* Rotate Kaaba image relative to phone heading */
  const markerRotation =
    qiblaDirection !== null ? (qiblaDirection - heading + 360) % 360 : 0;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-48 mb-4">
        {/* Compass dial */}
        <div className="absolute inset-0 border-4 border-muted rounded-full flex items-center justify-center">
          <Compass className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RotateCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Kaaba image marker */}
        {qiblaDirection !== null && !isLoading && (
          <div
            className="absolute top-0 left-1/2 w-8 h-8 -translate-x-1/2"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "32px", // image size
              height: "32px",
              transform: `
                translate(-50%, -50%)            /* centre the container */
                rotate(${markerRotation}deg)      /* spin around the centre */
                translateY(-96px)                 /* push to the rim */
              `,
              transformOrigin: "center",
            }}
          >
            {/* 🖼️  Place kaaba.png in `/public` so the path is `/kaaba.png` */}
            <Image
              src="/qibla.png"
              alt="Kaaba"
              fill
              sizes="32px"
              style={{ objectFit: "contain" }}
            />
          </div>
        )}

        {/* Error fallback */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {error}
          </div>
        )}
      </div>

      {qiblaDirection !== null && (
        <div className="text-center mb-4">
          <p className="text-lg font-bold">{qiblaDirection.toFixed(1)}°</p>
          <p className="text-sm text-muted-foreground">from True North</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

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

        <Button
          variant="outline"
          size="sm"
          onClick={findQiblaDirection}
          disabled={isLoading}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>
      </div>
    </div>
  );
}
