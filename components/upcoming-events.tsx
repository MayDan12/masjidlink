"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  masjid: string;
  attendees: number;
  type: "lecture" | "janazah" | "iftar" | "other";
};

export function UpcomingEvents() {
  // Mock data for upcoming events
  const events: Event[] = [
    {
      id: "1",
      title: "Friday Khutbah: Patience in Hardship",
      date: "Friday, Apr 26",
      time: "1:00 PM",
      location: "Masjid Al-Noor",
      masjid: "Masjid Al-Noor",
      attendees: 120,
      type: "lecture",
    },
    {
      id: "2",
      title: "Community Iftar",
      date: "Saturday, Apr 27",
      time: "7:30 PM",
      location: "Islamic Center",
      masjid: "Islamic Center",
      attendees: 85,
      type: "iftar",
    },
    {
      id: "3",
      title: "Janazah Prayer for Brother Ahmed",
      date: "Sunday, Apr 28",
      time: "10:00 AM",
      location: "Masjid Al-Rahma",
      masjid: "Masjid Al-Rahma",
      attendees: 45,
      type: "janazah",
    },
  ];

  // Get event type badge color
  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800";
      case "janazah":
        return "bg-gray-100 text-gray-800";
      case "iftar":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Community events and gatherings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{event.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(
                    event.type
                  )}`}
                >
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 mr-2" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="link" asChild>
            <Link href="/events">View All Events</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
