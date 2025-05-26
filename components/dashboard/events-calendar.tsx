"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, CalendarIcon, Filter } from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: "lecture" | "community" | "prayer" | "other";
};

export function EventsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [filter, setFilter] = useState<string>("all");

  // Mock events data
  const events: Event[] = [
    {
      id: "1",
      title: "Friday Khutbah",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "1:30 PM",
      location: "Masjid Al-Noor",
      type: "prayer",
    },
    {
      id: "2",
      title: "Islamic History Lecture",
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      time: "7:00 PM",
      location: "Islamic Center",
      type: "lecture",
    },
    {
      id: "3",
      title: "Community Iftar",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: "6:30 PM",
      location: "Masjid Al-Rahman",
      type: "community",
    },
    {
      id: "4",
      title: "Youth Group Meeting",
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      time: "5:00 PM",
      location: "Islamic Center",
      type: "community",
    },
    {
      id: "5",
      title: "Quran Study Circle",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: "8:00 PM",
      location: "Masjid Al-Noor",
      type: "lecture",
    },
  ];

  // Filter events based on selected filter
  const filteredEvents =
    filter === "all" ? events : events.filter((event) => event.type === filter);

  // Get events for the selected date
  const selectedDateEvents = date
    ? filteredEvents.filter(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear()
      )
    : [];

  // Get dates with events for highlighting in the calendar
  const eventDates = filteredEvents.map((event) => event.date);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setView("month")}>
            Month
          </Button>
          <Button variant="outline" size="sm" onClick={() => setView("week")}>
            Week
          </Button>
          <Button variant="outline" size="sm" onClick={() => setView("day")}>
            Day
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="prayer">Prayer Events</SelectItem>
              <SelectItem value="lecture">Lectures</SelectItem>
              <SelectItem value="community">Community Events</SelectItem>
              <SelectItem value="other">Other Events</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-7 gap-4">
        <div className="md:col-span-5">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              event: (date) =>
                eventDates.some(
                  (eventDate) =>
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear()
                ),
            }}
            modifiersClassNames={{
              event: "bg-primary/10 font-bold text-primary",
            }}
            components={{
              DayContent: ({ date, ...props }) => {
                const hasEvent = eventDates.some(
                  (eventDate) =>
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear()
                );
                return (
                  <div className="relative">
                    <div {...props}>{date.getDate()}</div>
                    {hasEvent && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                );
              },
            }}
          />
        </div>

        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setDate(new Date(date!.setDate(date!.getDate() - 1)))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setDate(new Date(date!.setDate(date!.getDate() + 1)))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.location}
                        </p>
                      </div>
                      <Badge
                        variant={
                          event.type === "prayer"
                            ? "default"
                            : event.type === "lecture"
                            ? "secondary"
                            : event.type === "community"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No events scheduled for this day</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
