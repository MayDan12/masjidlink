"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import { Bell, Calendar, MapPin, PlayIcon, Pause } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Masjid } from "@/types/masjid";
import { getAllMasjids } from "@/app/(dashboards)/dashboard/masjids/action";

type PrayerTimesDisplayProps = {
  view?: "daily" | "weekly" | "monthly";
};

/* --------------------------------------------------------------
   1️⃣  CONFIG — map prayer → audio file in /public/audio/
----------------------------------------------------------------*/
const audioFiles: Record<string, string> = {
  Fajr: "/audio/azan1.mp3",
  Sunrise: "/audio/azan2.mp3",
  Dhuhr: "/audio/azan3.mp3",
  Asr: "/audio/azan4.mp3",
  Maghrib: "/audio/azan5.mp3",
  Isha: "/audio/azan6.mp3",
};

/* Help: turn a "5:15 AM" string into today’s Date object */
const toTodayDate = (time: string) => {
  const [t, mer] = time.split(" ");
  let [h, m] = t.split(":").map(Number);
  if (mer.toLowerCase() === "pm" && h !== 12) h += 12;
  if (mer.toLowerCase() === "am" && h === 12) h = 0;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

type PrayerTime = {
  name: string;
  time: string;
};

export function PrayerTimesDisplay({
  view = "daily",
}: PrayerTimesDisplayProps) {
  /* -------------------- 2️⃣  STATE --------------------------- */
  const [selectedMasjid, setSelectedMasjid] = useState("");
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextTimeout = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);
  const [masjids, setMasjids] = useState<Masjid[]>([]);

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

  // using the details of the seected masjid to get the prayer times
  const selectedMasjidDetails = useMemo(() => {
    return masjids.find((masjid) => masjid.id === selectedMasjid);
  }, [masjids, selectedMasjid]);

  /* -------------------- 3️⃣  DAILY DATA (mock) --------------- */
  const prayerTimes = useMemo<PrayerTime[]>(
    () => [
      { name: "Fajr", time: "5:15 AM" },
      { name: "Sunrise", time: "6:30 AM" },
      { name: "Dhuhr", time: "12:30 PM" },
      { name: "Asr", time: "3:45 PM" },
      { name: "Maghrib", time: "6:15 PM" },
      { name: "Isha", time: "7:45 PM" },
    ],
    [],
  );

  /* -------------------- 4️⃣  CORE AUDIO LOGIC ---------------- */
  const playPrayer = useCallback((prayerName: string) => {
    audioRef.current?.pause();

    const src = audioFiles[prayerName] ?? "/audio/default.mp3";
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.play().catch(() => {});
    setCurrentPrayer(prayerName);
    setIsPlaying(true);

    audio.onended = () => setIsPlaying(false);
  }, []); // Include audioFiles if it changes

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayClick = (prayerName: string) => {
    if (currentPrayer === prayerName) {
      togglePlayPause();
    } else {
      playPrayer(prayerName);
    }
  };

  /* -------------------- 5️⃣  AUTO‑SCHEDULER ------------------ */
  const scheduleNextPrayer = useCallback(() => {
    if (nextTimeout.current) clearTimeout(nextTimeout.current);

    const now = new Date();

    const upcoming = prayerTimes
      .map((p) => ({ ...p, date: toTodayDate(p.time) }))
      .find((p) => p.date > now);

    if (!upcoming) return;

    const diff = upcoming.date.getTime() - now.getTime();

    nextTimeout.current = setTimeout(() => {
      playPrayer(upcoming.name);
      scheduleNextPrayer(); // schedule the next one
    }, diff);
  }, [prayerTimes, playPrayer]);

  useEffect(() => {
    scheduleNextPrayer();

    return () => {
      if (nextTimeout.current) {
        clearTimeout(nextTimeout.current);
      }
    };
  }, [selectedMasjid, scheduleNextPrayer]);

  /* -------------------- 6️⃣  RENDER -------------------------- */

  if (view === "weekly" || view === "monthly") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Select value={selectedMasjid} onValueChange={setSelectedMasjid}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select a masjid" />
            </SelectTrigger>
            <SelectContent>
              {masjids.map((masjid) => (
                <SelectItem key={masjid.id} value={masjid.id}>
                  {masjid.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              {view === "weekly" ? "Previous Week" : "Previous Month"}
            </Button>
            <Button variant="outline" size="sm">
              {view === "weekly" ? "Next Week" : "Next Month"}
              <Calendar className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Date</th>
                <th className="text-center p-3">Fajr</th>
                <th className="text-center p-3">Sunrise</th>
                <th className="text-center p-3">Dhuhr</th>
                <th className="text-center p-3">Asr</th>
                <th className="text-center p-3">Maghrib</th>
                <th className="text-center p-3">Isha</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: view === "weekly" ? 7 : 10 }).map(
                (_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() + index);
                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-muted/50" : ""}
                    >
                      <td className="p-3 font-medium">
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="text-center p-3">5:15 AM</td>
                      <td className="text-center p-3">6:30 AM</td>
                      <td className="text-center p-3">12:30 PM</td>
                      <td className="text-center p-3">3:45 PM</td>
                      <td className="text-center p-3">6:15 PM</td>
                      <td className="text-center p-3">7:45 PM</td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Masjid + date header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Select value={selectedMasjid} onValueChange={setSelectedMasjid}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select a masjid" />
          </SelectTrigger>
          <SelectContent>
            {/* There should be a default one */}

            {masjids.map((masjid) => (
              <SelectItem
                onSelect={() => setSelectedMasjid(masjid.id)}
                key={masjid.id}
                value={masjid.id}
              >
                {masjid.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {!selectedMasjidDetails ? (
            <span className="text-muted-foreground">No location available</span>
          ) : (
            selectedMasjidDetails.address
          )}
          <span className="mx-2">•</span>
          <Calendar className="h-4 w-4 mr-1" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Prayer grid */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {prayerTimes.map((prayer) => {
          const prayerDate = toTodayDate(prayer.time);
          const isPassed = prayerDate < new Date();
          const isNext =
            !isPassed &&
            !prayerTimes.some(
              (p) => toTodayDate(p.time) > new Date() && p.name !== prayer.name,
            );
          return (
            <Card key={prayer.name} className={isNext ? "border-primary" : ""}>
              <CardContent className="p-4 flex md:flex-col justify-between items-center">
                <div>
                  <h3 className="font-medium">{prayer.name}</h3>
                  <p
                    className={`text-lg font-bold ${
                      isPassed ? "text-muted-foreground" : ""
                    }`}
                  >
                    {prayer.time}
                  </p>
                </div>

                {/* badges + play/pause */}
                <div className="flex items-center gap-2">
                  {isPassed ? (
                    <Badge variant="outline" className="bg-muted">
                      Passed
                    </Badge>
                  ) : isNext ? (
                    <Badge className="bg-primary">Next</Badge>
                  ) : (
                    <Badge variant="outline">Upcoming</Badge>
                  )}

                  {/* reminder button — stub */}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Set Reminder</span>
                  </Button>

                  {/* play / pause button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePlayClick(prayer.name)}
                  >
                    {currentPrayer === prayer.name && isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <PlayIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {currentPrayer === prayer.name && isPlaying
                        ? "Pause"
                        : "Play"}{" "}
                      Adhan
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* (optional) progress bar until next prayer */}
      {(() => {
        const now = new Date();
        const next = prayerTimes
          .map((p) => toTodayDate(p.time))
          .find((d) => d > now);
        if (!next) return null;
        const prev = [...prayerTimes]
          .map((p) => toTodayDate(p.time))
          .reverse()
          .find((d) => d <= now);
        if (!prev) return null;
        const pct =
          ((now.getTime() - prev.getTime()) /
            (next.getTime() - prev.getTime())) *
          100;
        return (
          <div className="mt-4">
            <Progress value={pct} className="h-2" />
          </div>
        );
      })()}
    </div>
  );
}
