"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Clock, MapPin, Users, X } from "lucide-react";
import { toast } from "sonner";
import { getEventsByUserId } from "@/app/(dashboards)/imam/events/action";
import { auth } from "@/firebase/client";
import { Events } from "@/types/events";

// Define the Event type at the top level

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Events[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get event type badge color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800";
      case "janazah":
        return "bg-gray-100 text-gray-800";
      case "iftar":
        return "bg-green-100 text-green-800";
      case "class":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Fetch events from backend
  useEffect(() => {
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

        // Ensure we have events data, fallback to empty array if undefined
        const eventsData = result.events || [];

        // Convert date strings to Date objects with validation
        const formattedEvents = eventsData
          .map((event) => {
            try {
              const date = new Date(event.date);
              return isNaN(date.getTime()) ? null : { ...event, date };
            } catch {
              return null;
            }
          })
          .filter((event): event is Events => event !== null);

        setEvents(formattedEvents);
      } catch (error) {
        toast.error("Failed to fetch events");
        console.error("Error fetching events:", error);
        setEvents([]); // Reset to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle event click
  const handleEventClick = (event: Events) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  // Get events for the selected date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Get dates with events for highlighting in the calendar
  const datesWithEvents = events.map((event) => event.date);

  // Handle date selection from calendar
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    // If there's only one event on this date, open it directly
    const eventsOnDate = getEventsForDate(selectedDate);
    if (eventsOnDate.length === 1) {
      handleEventClick(eventsOnDate[0]);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-7">
      <Card className="md:col-span-5">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              event: datesWithEvents,
            }}
            modifiersStyles={{
              event: {
                fontWeight: "bold",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">
              Events for{" "}
              {date?.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="mx-auto h-8 w-8 mb-2 opacity-50 animate-spin" />
                  <p>Loading events...</p>
                </div>
              ) : getEventsForDate(date).length > 0 ? (
                getEventsForDate(date).map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge className={`${getEventTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
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
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No events scheduled for this date</p>
                  <Button variant="link" size="sm" className="mt-2">
                    + Add Event
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge
                className={`${
                  selectedEvent ? getEventTypeColor(selectedEvent.type) : ""
                }`}
              >
                {/* {selectedEvent?.type.charAt(0).toUpperCase() +
                  selectedEvent?.type.slice(1)} */}
              </Badge>
              <Button variant="outline" size="sm" className="gap-1">
                <Users className="h-4 w-4" />
                {selectedEvent?.rsvps.length} attending
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {selectedEvent?.startTime} - {selectedEvent?.endTime}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{selectedEvent?.location}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                {selectedEvent?.description}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit Event
              </Button>
              <Button variant="destructive" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
