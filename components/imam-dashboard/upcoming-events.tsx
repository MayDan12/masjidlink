"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarPlus,
  Clock,
  Loader,
  MapPin,
  PlusCircle,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types/events";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getEventsByUserId } from "@/app/(dashboards)/imam/events/action";
import { auth } from "@/firebase/client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

export function UpcomingEventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const result = await getEventsByUserId({ token });

      if (!result.success) {
        toast.error(result.message || "Failed to fetch events");
        return;
      }

      if (!result.events || result.events.length === 0) {
        toast.info("No events found");
        setEvents([]);
        return;
      }

      const res = result?.events;

      setEvents(res);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Call fetchEvents on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Get event type badge color
  const getEventTypeColor = (type: string) => {
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-md mx-auto">
          <Card className="border-dashed">
            <CardContent className="pt-6 pb-8 px-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <CalendarPlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-2">No events found</CardTitle>
              <CardDescription className="mb-6 max-w-sm">
                You don&apos;t have any events yet. Create your first event to
                get started.
              </CardDescription>
              <Button className="px-6">
                <Link href="/imam/events" className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Event
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="loader">
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          </div>
        </div>
      )}

      {/* Events list */}

      {events.map((event) => (
        <div key={event.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="font-normal text-sm text-gray-400">
                {event.description}
              </p>
            </div>
            <Badge className={getEventTypeColor(event.type)}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
          </div>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-2" />
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-3.5 w-3.5 mr-2" />
              <span>{event.rsvps.length} attending</span>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <Button variant="link" size="sm">
          <Link href="/imam/events"> View All Events</Link>
        </Button>
      </div>
    </div>
  );
}
