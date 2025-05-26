"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, X, Check } from "lucide-react";

type MyEvent = {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  address: string;
  type: "lecture" | "community" | "prayer" | "other";
  status: "registered" | "interested" | "invited";
};

export function MyEvents() {
  const [activeTab, setActiveTab] = useState("registered");

  // Mock events data
  const myEvents: MyEvent[] = [
    {
      id: "1",
      title: "Friday Khutbah",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "1:30 PM",
      location: "Masjid Al-Noor",
      address: "123 Main St, Chicago, IL",
      type: "prayer",
      status: "registered",
    },
    {
      id: "3",
      title: "Community Iftar",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: "6:30 PM",
      location: "Masjid Al-Rahman",
      address: "789 Elm St, Chicago, IL",
      type: "community",
      status: "registered",
    },
    {
      id: "2",
      title: "Islamic History Lecture",
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      time: "7:00 PM",
      location: "Islamic Center",
      address: "456 Oak Ave, Chicago, IL",
      type: "lecture",
      status: "interested",
    },
    {
      id: "5",
      title: "Quran Study Circle",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: "8:00 PM",
      location: "Masjid Al-Noor",
      address: "123 Main St, Chicago, IL",
      type: "lecture",
      status: "invited",
    },
  ];

  // Filter events based on active tab
  const filteredEvents = myEvents.filter((event) => event.status === activeTab);

  const removeEvent = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Remove event ${id}`);
  };

  const acceptInvitation = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Accept invitation for event ${id}`);
  };

  const declineInvitation = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Decline invitation for event ${id}`);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="registered">Registered</TabsTrigger>
          <TabsTrigger value="interested">Interested</TabsTrigger>
          <TabsTrigger value="invited">Invitations</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-24 flex-shrink-0 flex flex-col items-center justify-center bg-muted rounded-md p-3">
                    <span className="text-xl font-bold">
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
                          <h3 className="font-medium">{event.title}</h3>
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
                        </div>
                      </div>
                      {event.status === "invited" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => acceptInvitation(event.id)}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => declineInvitation(event.id)}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => removeEvent(event.id)}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          {event.status === "registered" ? "Cancel" : "Remove"}
                        </Button>
                      )}
                    </div>
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
              {activeTab === "registered"
                ? "You haven't registered for any events yet."
                : activeTab === "interested"
                ? "You haven't marked any events as interested."
                : "You don't have any event invitations."}
            </p>
            <Button>Browse Events</Button>
          </div>
        )}
      </div>
    </div>
  );
}
