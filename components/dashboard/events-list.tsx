"use client";

import { useState } from "react";
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

type Event = {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  address: string;
  description: string;
  attendees: number;
  type: "lecture" | "community" | "prayer" | "other";
  isRegistered: boolean;
};

export function EventsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("upcoming");

  // Mock events data
  const events: Event[] = [
    {
      id: "1",
      title: "Friday Khutbah",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "1:30 PM",
      location: "Masjid Al-Noor",
      address: "123 Main St, Chicago, IL",
      description: "Weekly Friday sermon and prayer.",
      attendees: 120,
      type: "prayer",
      isRegistered: true,
    },
    {
      id: "2",
      title: "Islamic History Lecture",
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      time: "7:00 PM",
      location: "Islamic Center",
      address: "456 Oak Ave, Chicago, IL",
      description: "A lecture on the history of Islam in North America.",
      attendees: 45,
      type: "lecture",
      isRegistered: false,
    },
    {
      id: "3",
      title: "Community Iftar",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: "6:30 PM",
      location: "Masjid Al-Rahman",
      address: "789 Elm St, Chicago, IL",
      description: "Join us for a community iftar dinner during Ramadan.",
      attendees: 200,
      type: "community",
      isRegistered: true,
    },
    {
      id: "4",
      title: "Youth Group Meeting",
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      time: "5:00 PM",
      location: "Islamic Center",
      address: "456 Oak Ave, Chicago, IL",
      description: "Weekly meeting for the youth group. All teens welcome!",
      attendees: 30,
      type: "community",
      isRegistered: false,
    },
    {
      id: "5",
      title: "Quran Study Circle",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: "8:00 PM",
      location: "Masjid Al-Noor",
      address: "123 Main St, Chicago, IL",
      description: "Weekly Quran study and discussion group.",
      attendees: 25,
      type: "lecture",
      isRegistered: false,
    },
  ];

  // Filter events based on search query, filter, and timeframe
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filter === "all" || event.type === filter;

    const today = new Date();
    const isUpcoming = event.date >= today;
    const isPast = event.date < today;
    const matchesTimeframe =
      (timeframe === "upcoming" && isUpcoming) ||
      (timeframe === "past" && isPast) ||
      timeframe === "all";

    return matchesSearch && matchesFilter && matchesTimeframe;
  });

  const toggleRegistration = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Toggle registration for event ${id}`);
  };

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
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-center bg-muted rounded-md p-3">
                    <span className="text-2xl font-bold">
                      {event.date.getDate()}
                    </span>
                    <span className="text-sm font-medium">
                      {event.date.toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">{event.title}</h3>
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
                        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={event.isRegistered ? "outline" : "default"}
                        onClick={() => toggleRegistration(event.id)}
                      >
                        {event.isRegistered ? "Registered" : "Register"}
                      </Button>
                    </div>
                    <p className="text-sm mt-2">{event.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{event.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
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
