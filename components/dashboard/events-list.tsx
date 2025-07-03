"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, Users, Search } from "lucide-react";
import { getEvents } from "@/app/(dashboards)/dashboard/events/action";
import { Event } from "@/types/events";
import Link from "next/link";

export function EventsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("upcoming");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filter === "all" || event.type === filter;

      // Uncomment and implement when you have date handling
      const today = new Date();
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate >= today;
      const isPast = eventDate < today;
      const matchesTimeframe =
        (timeframe === "upcoming" && isUpcoming) ||
        (timeframe === "past" && isPast) ||
        timeframe === "all";

      return matchesSearch && matchesFilter && matchesTimeframe;
    });
  }, [events, searchQuery, filter, timeframe]);
  // }, [events, searchQuery, filter, timeframe]);

  // Fetch events with error handling
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEvents();
      if (response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const toggleRegistration = useCallback((id: string) => {
    console.log(`Toggle registration for event ${id}`);
    // In a real app, this would update state and possibly save to a database
  }, []);

  // Event card component to prevent re-rendering all cards when one changes
  const EventCard = useCallback(
    ({ event }: { event: Event }) => (
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4 h-full flex flex-col">
          {/* Date Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{event.date}</span>
            </div>
            <Badge variant="default">{event.type}</Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-2 flex-shrink-0" />
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-2 flex-shrink-0" />
              <span>
                {event.rsvps.length}/
                {event.maxAttendees ? event.maxAttendees : "50+"} attendees
              </span>
            </div>
          </div>
          <Button
            size="sm"
            className="px-2"
            disabled={!event.meetingLink}
            aria-label={`livestream for ${event.title}`}
          >
            {!event.meetingLink ? (
              "Not yet Started"
            ) : (
              <Link href={event?.meetingLink}> Join Livestream</Link>
            )}
          </Button>

          {/* Register Button */}
          {/* <Button
            onClick={() => toggleRegistration(event.id)}
            variant={event.registered ? "outline" : "default"}
            size="sm"
            className="w-full mt-auto"
          >
            {event.registered ? "Registered ✓" : "Register"}
          </Button> */}
        </CardContent>
      </Card>
    ),
    [toggleRegistration]
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              disabled
            />
          </div>
          <Select disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Loading..." />
            </SelectTrigger>
          </Select>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-32 h-24 bg-muted rounded-md animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-full animate-pulse" />
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
      </div>

      <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Events Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No events match your search criteria."
                : timeframe === "upcoming"
                ? "There are no upcoming events scheduled."
                : "There are no past events to display."}
            </p>
          </div>
        )}
      </div>

      {filteredEvents.length > 0 && (
        <div className="text-center">
          <Button variant="outline">Load More Events</Button>
        </div>
      )}
    </div>
  );
}
