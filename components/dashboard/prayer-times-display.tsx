"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Calendar, Clock, MapPin, PlayIcon } from "lucide-react";

type PrayerTime = {
  name: string;
  time: string;
  isNext: boolean;
  isPassed: boolean;
};

type PrayerTimesDisplayProps = {
  view?: "daily" | "weekly" | "monthly";
};

export function PrayerTimesDisplay({
  view = "daily",
}: PrayerTimesDisplayProps) {
  const [selectedMasjid, setSelectedMasjid] = useState("masjid-al-noor");
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Mock prayer times data
  const prayerTimes: PrayerTime[] = [
    { name: "Fajr", time: "5:15 AM", isNext: false, isPassed: true },
    { name: "Sunrise", time: "6:30 AM", isNext: false, isPassed: true },
    { name: "Dhuhr", time: "12:30 PM", isNext: false, isPassed: true },
    { name: "Asr", time: "3:45 PM", isNext: true, isPassed: false },
    { name: "Maghrib", time: "6:15 PM", isNext: false, isPassed: false },
    { name: "Isha", time: "7:45 PM", isNext: false, isPassed: false },
  ];

  // Find the next prayer time
  const nextPrayer = prayerTimes.find((prayer) => prayer.isNext);

  // Calculate time until next prayer
  const timeUntilNext = nextPrayer ? "2 hours 15 minutes" : "";

  // Calculate progress until next prayer (mock value)
  const progressValue = 65;

  if (view === "weekly" || view === "monthly") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Select value={selectedMasjid} onValueChange={setSelectedMasjid}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select a masjid" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masjid-al-noor">Masjid Al-Noor</SelectItem>
              <SelectItem value="islamic-center">Islamic Center</SelectItem>
              <SelectItem value="masjid-al-rahman">Masjid Al-Rahman</SelectItem>
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
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Select value={selectedMasjid} onValueChange={setSelectedMasjid}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select a masjid" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masjid-al-noor">Masjid Al-Noor</SelectItem>
            <SelectItem value="islamic-center">Islamic Center</SelectItem>
            <SelectItem value="masjid-al-rahman">Masjid Al-Rahman</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>Chicago, IL</span>
          <span className="mx-2">•</span>
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {nextPrayer && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">
                  Next Prayer: {nextPrayer.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Time remaining: {timeUntilNext}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold">{nextPrayer.time}</span>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Previous: Dhuhr</span>
                <span>Next: Maghrib</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {prayerTimes.map((prayer) => (
          <Card
            key={prayer.name}
            className={prayer.isNext ? "border-primary" : ""}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{prayer.name}</h3>
                <p
                  className={`text-lg font-bold ${
                    prayer.isPassed ? "text-muted-foreground" : ""
                  }`}
                >
                  {prayer.time}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {prayer.isPassed ? (
                  <Badge variant="outline" className="bg-muted">
                    Passed
                  </Badge>
                ) : prayer.isNext ? (
                  <Badge className="bg-primary">Next</Badge>
                ) : (
                  <Badge variant="outline">Upcoming</Badge>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Set Reminder</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <PlayIcon className="h-4 w-4" />
                  <span className="sr-only">Listen to Azan</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
        <div>Calculation Method: Muslim World League</div>
        <Button variant="link" size="sm" className="gap-1">
          <Settings className="h-3 w-3" />
          Adjust Settings
        </Button>
      </div> */}
    </div>
  );
}
