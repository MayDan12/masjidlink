"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Heart,
} from "lucide-react";

type CommunityEvent = {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  address: string;
  description: string;
  attendees: number;
  organizer: string;
  category: "social" | "education" | "charity" | "religious" | "other";
  isSaved: boolean;
  image?: string;
};

export function CommunityEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  // Mock events data
  const events: CommunityEvent[] = [
    {
      id: "1",
      title: "Community Iftar",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: "6:30 PM",
      location: "Masjid Al-Rahman",
      address: "789 Elm St, Chicago, IL",
      description: "Join us for a community iftar dinner during Ramadan.",
      attendees: 200,
      organizer: "Masjid Al-Rahman",
      category: "social",
      isSaved: true,
      image: "/placeholder.svg?height=120&width=240",
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
      organizer: "Islamic Center",
      category: "education",
      isSaved: false,
      image: "/placeholder.svg?height=120&width=240",
    },
    {
      id: "3",
      title: "Charity Fundraiser",
      date: new Date(new Date().setDate(new Date().getDate() + 10)),
      time: "5:00 PM",
      location: "Community Hall",
      address: "101 Main St, Chicago, IL",
      description:
        "Annual fundraiser for local and international charity projects.",
      attendees: 150,
      organizer: "Muslim Charity Foundation",
      category: "charity",
      isSaved: true,
      image: "/placeholder.svg?height=120&width=240",
    },
    {
      id: "4",
      title: "Eid Prayer",
      date: new Date(new Date().setDate(new Date().getDate() + 15)),
      time: "8:00 AM",
      location: "City Park",
      address: "200 Park Ave, Chicago, IL",
      description: "Eid prayer and celebration for the entire community.",
      attendees: 500,
      organizer: "Islamic Council",
      category: "religious",
      isSaved: false,
      image: "/placeholder.svg?height=120&width=240",
    },
    {
      id: "5",
      title: "Youth Sports Day",
      date: new Date(new Date().setDate(new Date().getDate() + 8)),
      time: "10:00 AM",
      location: "Community Sports Center",
      address: "300 Sports Blvd, Chicago, IL",
      description: "A day of sports and activities for Muslim youth.",
      attendees: 80,
      organizer: "Muslim Youth Association",
      category: "social",
      isSaved: false,
      image: "/placeholder.svg?height=120&width=240",
    },
  ];

  // Filter events based on search query and active tab
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const today = new Date();
    const isUpcoming = event.date >= today;
    const isPast = event.date < today;
    const matchesTab =
      (activeTab === "upcoming" && isUpcoming) ||
      (activeTab === "past" && isPast) ||
      (activeTab === "saved" && event.isSaved) ||
      activeTab === "all";

    return matchesSearch && matchesTab;
  });

  const toggleSaveEvent = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Toggle save for event ${id}`);
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
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button className="gap-1">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-48 flex-shrink-0">
                    <div className="relative">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="rounded-md w-full h-32 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm"
                        onClick={() => toggleSaveEvent(event.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            event.isSaved ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                        <span className="sr-only">
                          {event.isSaved ? "Remove from saved" : "Save event"}
                        </span>
                      </Button>
                    </div>
                    <div className="mt-2 text-center bg-muted rounded-md p-2">
                      <p className="text-sm font-medium">
                        {event.date.toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <p className="text-xl font-bold">
                        {event.date.toLocaleDateString("en-US", {
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm">
                        {event.date.toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">{event.title}</h3>
                          <Badge
                            variant={
                              event.category === "social"
                                ? "default"
                                : event.category === "education"
                                ? "secondary"
                                : event.category === "charity"
                                ? "outline"
                                : event.category === "religious"
                                ? "destructive"
                                : "default"
                            }
                            className="capitalize"
                          >
                            {event.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Organized by {event.organizer}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
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
                      <Button>RSVP</Button>
                    </div>
                    <p className="text-sm mt-3">{event.description}</p>
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
                : activeTab === "upcoming"
                ? "There are no upcoming events scheduled."
                : activeTab === "past"
                ? "There are no past events to display."
                : "You haven't saved any events yet."}
            </p>
            <Button>Browse All Events</Button>
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
