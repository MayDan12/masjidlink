"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type PrayerTime = {
  name: string;
  time: string;
  arabicName: string;
  isNext: boolean;
  isPast: boolean;
  isCurrent: boolean;
};

export function PrayerTimesWidget() {
  const [timeOfDay, setTimeOfDay] = useState<"dawn" | "day" | "dusk" | "night">(
    "day"
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState("");
  const [progressToNextPrayer, setProgressToNextPrayer] = useState(0);

  // Mock prayer times - in a real app, these would come from an API based on location
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Sample prayer times for demonstration
    const mockPrayerTimes: PrayerTime[] = [
      {
        name: "Fajr",
        arabicName: "الفجر",
        time: `${today}T05:15:00`,
        isNext: false,
        isPast: false,
        isCurrent: false,
      },
      {
        name: "Sunrise",
        arabicName: "الشروق",
        time: `${today}T06:30:00`,
        isNext: false,
        isPast: false,
        isCurrent: false,
      },
      {
        name: "Dhuhr",
        arabicName: "الظهر",
        time: `${today}T12:30:00`,
        isNext: false,
        isPast: false,
        isCurrent: false,
      },
      {
        name: "Asr",
        arabicName: "العصر",
        time: `${today}T15:45:00`,
        isNext: false,
        isPast: false,
        isCurrent: false,
      },
      {
        name: "Maghrib",
        arabicName: "المغرب",
        time: `${today}T18:15:00`,
        isNext: false,
        isPast: false,
        isCurrent: false,
      },
      {
        name: "Isha",
        arabicName: "العشاء",
        time: `${today}T19:45:00`,
        isNext: false,
        isPast: false,
        isCurrent: false,
      },
    ];

    // Update prayer times status
    const updatedPrayerTimes = mockPrayerTimes.map((prayer, index) => {
      const prayerDate = new Date(prayer.time);
      const isPast = prayerDate < now;

      // Find the next prayer
      let isNext = false;
      if (!isPast && (index === 0 || mockPrayerTimes[index - 1].isPast)) {
        isNext = true;
      }

      // If all prayers are past, the first prayer of the next day is next
      if (index === mockPrayerTimes.length - 1 && isPast) {
        mockPrayerTimes[0].isNext = true;
      }

      // Determine if this is the current prayer period
      const isCurrent =
        isPast &&
        (index === mockPrayerTimes.length - 1 ||
          !mockPrayerTimes[index + 1].isPast);

      return {
        ...prayer,
        isPast,
        isNext,
        isCurrent,
      };
    });

    setPrayerTimes(updatedPrayerTimes);

    // Find the next prayer
    const next =
      updatedPrayerTimes.find((p) => p.isNext) || updatedPrayerTimes[0];
    setNextPrayer(next);

    // Determine time of day for background
    const hour = now.getHours();
    if (hour >= 5 && hour < 7) setTimeOfDay("dawn");
    else if (hour >= 7 && hour < 17) setTimeOfDay("day");
    else if (hour >= 17 && hour < 19) setTimeOfDay("dusk");
    else setTimeOfDay("night");
  }, [currentTime]);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      // Calculate time until next prayer
      if (nextPrayer) {
        const now = new Date();
        const nextPrayerTime = new Date(nextPrayer.time);

        // If next prayer is tomorrow's Fajr
        if (nextPrayer.name === "Fajr" && nextPrayerTime < now) {
          nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
        }

        const diffMs = nextPrayerTime.getTime() - now.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        setTimeUntilNextPrayer(`${diffHrs}h ${diffMins}m`);

        // Calculate progress
        const currentPrayerIndex = prayerTimes.findIndex((p) => p.isCurrent);
        if (currentPrayerIndex !== -1) {
          const currentPrayer = prayerTimes[currentPrayerIndex];
          const currentPrayerTime = new Date(currentPrayer.time);
          const nextPrayerTime = new Date(nextPrayer.time);

          const totalDuration =
            nextPrayerTime.getTime() - currentPrayerTime.getTime();
          const elapsed = now.getTime() - currentPrayerTime.getTime();
          const progress = Math.min(
            100,
            Math.max(0, (elapsed / totalDuration) * 100)
          );

          setProgressToNextPrayer(progress);
        }
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextPrayer, prayerTimes]);

  // Format time for display
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Background classes based on time of day
  const backgroundClasses = {
    dawn: "bg-gradient-to-b from-indigo-900 via-purple-800 to-orange-500",
    day: "bg-gradient-to-b from-sky-400 to-sky-200",
    dusk: "bg-gradient-to-b from-orange-500 via-purple-800 to-indigo-900",
    night: "bg-gradient-to-b from-slate-900 to-slate-700",
  };

  // Text color based on time of day
  const textColorClasses = {
    dawn: "text-white",
    day: "text-slate-900",
    dusk: "text-white",
    night: "text-white",
  };

  return (
    <Card className="overflow-hidden">
      <div className={cn("h-48 relative", backgroundClasses[timeOfDay])}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <h2
            className={cn(
              "text-3xl font-bold mb-2 font-amiri",
              textColorClasses[timeOfDay]
            )}
          >
            {nextPrayer?.arabicName}
          </h2>
          <p className={cn("text-xl mb-4", textColorClasses[timeOfDay])}>
            Next Prayer: {nextPrayer?.name} at{" "}
            {nextPrayer ? formatTime(nextPrayer.time) : ""}
          </p>
          <div className="w-full max-w-md">
            <Progress value={progressToNextPrayer} className="h-2" />
          </div>
          <p className={cn("mt-2 text-sm", textColorClasses[timeOfDay])}>
            {timeUntilNextPrayer} until {nextPrayer?.name}
          </p>
        </div>
      </div>
      <CardContent className="grid grid-cols-3 md:grid-cols-6 gap-4 p-4">
        {prayerTimes.map((prayer) => (
          <div
            key={prayer.name}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg",
              prayer.isNext ? "bg-primary/10" : "",
              prayer.isCurrent ? "bg-secondary/20" : ""
            )}
          >
            <span className="text-sm font-medium">{prayer.name}</span>
            <span className="text-lg font-semibold">
              {formatTime(prayer.time)}
            </span>
            {prayer.isNext && (
              <Badge variant="outline" className="mt-1">
                Next
              </Badge>
            )}
            {prayer.isCurrent && (
              <Badge variant="secondary" className="mt-1">
                Current
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
