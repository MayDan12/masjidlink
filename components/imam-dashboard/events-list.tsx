"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Edit,
  Trash,
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { auth } from "@/firebase/client";
import {
  deleteEvent,
  getEventsByUserId,
} from "@/app/(dashboards)/imam/events/action";
import { toast } from "sonner";
import type { Event, EventType } from "@/types/events";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { EventEditForm } from "./event-edit-form";
import CreateMeetingButton from "@/app/(dashboards)/livestream/CreateMeetingButton";
import Link from "next/link";

export function EventsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // ✅ Extract fetch logic into a reusable function
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

      setEvents(result.events);
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

  // ✅ Updated handleDelete to refetch after deletion
  async function handleDelete(eventId: string) {
    // Show a toast with action buttons
    toast("Are you sure you want to delete this event?", {
      action: {
        label: "Delete",
        onClick: async () => {
          setIsDeleting(true);
          try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) {
              toast.error("Authentication required");
              return;
            }
            await deleteEvent({ token, eventId });
            toast.success("Event deleted successfully");
            await fetchEvents(); // Refetch data
          } catch (error) {
            toast.error(`Failed to delete event ${error}`);
          } finally {
            setIsDeleting(false);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}, // No action on cancel
      },
      duration: Number.POSITIVE_INFINITY, // Stays open until user acts
    });
  }

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventTypeColor = (type: EventType) => {
    const colors = {
      lecture: "bg-blue-100 text-blue-800",
      janazah: "bg-gray-100 text-gray-800",
      iftar: "bg-green-100 text-green-800",
      class: "bg-purple-100 text-purple-800",
      other: "bg-yellow-100 text-yellow-800",
    };
    return colors[type] || colors.other;
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

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  const EventActions = ({ event }: { event: Event }) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleEditClick(event)}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleDelete(event.id)}
      >
        <Trash className={`h-4 w-4 ${isDeleting ? "animate-spin" : ""}`} />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
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
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventEditForm
              event={selectedEvent}
              onClose={() => setDialogOpen(false)}
              onSuccess={fetchEvents}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Mobile card view (visible on small screens) */}
      <div className="lg:hidden space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-base">{event.title}</h3>
                    <p className="max-w-52 text-sm text-muted-foreground line-clamp-2 mt-1">
                      {event.description}
                    </p>
                  </div>
                  <Badge className={getEventTypeColor(event.type)}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2 mt-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>
                      {event.startTime}
                      {event.endTime ? ` - ${event.endTime}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>{event.rsvps.length} attendees</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  {!event.meetingLink ? (
                    <CreateMeetingButton
                      buttonText="Start Event"
                      eventId={event.id}
                      description={event.description}
                      dateTime={new Date(event.date + " " + event.startTime)}
                      onMeetingCreated={(call) => {
                        console.log("Call created:", call);
                      }}
                    />
                  ) : (
                    <Button>
                      <Link href={event.meetingLink}>Join livestream</Link>
                    </Button>
                  )}
                  <EventActions event={event} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No events found
          </div>
        )}
      </div>

      {/* Desktop table view (hidden on small screens) */}
      <div className="hidden lg:block rounded-md border">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="max-w-[300px]">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-4">
                        {event.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span>
                            {event.startTime}
                            {event.endTime ? ` - ${event.endTime}` : ""}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span>{event.rsvps.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex flex-col gap-2">
                      <EventActions event={event} />
                      {!event.meetingLink ? (
                        <CreateMeetingButton
                          buttonText="Start Event"
                          eventId={event.id}
                          description={event.description}
                          dateTime={
                            new Date(event.date + " " + event.startTime)
                          }
                          onMeetingCreated={(call) => {
                            console.log("Call created:", call);
                          }}
                        />
                      ) : (
                        <Button size="sm" className="px-2">
                          <Link href={event.meetingLink}>Join livestream</Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
