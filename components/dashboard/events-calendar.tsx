// "use client";

// import { useState, useEffect } from "react";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";
// import { toast } from "sonner";
// import { Events } from "@/types/events";
// import { getEvents } from "@/app/(dashboards)/dashboard/events/action";

// // Define the Event type at the top level

// export function EventsCalendar() {
//   const [date, setDate] = useState<Date | undefined>(new Date());
//   const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [events, setEvents] = useState<Events[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Get event type badge color
//   const getEventTypeColor = (type: string) => {
//     switch (type) {
//       case "lecture":
//         return "bg-blue-100 text-blue-800";
//       case "janazah":
//         return "bg-gray-100 text-gray-800";
//       case "iftar":
//         return "bg-green-100 text-green-800";
//       case "class":
//         return "bg-purple-100 text-purple-800";
//       default:
//         return "bg-yellow-100 text-yellow-800";
//     }
//   };

//   // Fetch events from backend
//   useEffect(() => {
//     const fetchEvents = async () => {
//       setIsLoading(true);
//       try {
//         const result = await getEvents();

//         if (!result.success) {
//           toast.error(result.message || "Failed to fetch events");
//           return;
//         }

//         const data = result.data;

//         // Convert date strings to Date objects with validation
//         const formattedEvents = data
//           .map((event: Events) => {
//             const date = new Date(event.date);
//             return isNaN(date.getTime()) ? null : { ...event, date };
//           })
//           .filter(Boolean) as Events[];

//         setEvents(formattedEvents);
//       } catch (error) {
//         toast.error("Failed to fetch events");
//         console.error("Error fetching events:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // Handle event click
//   const handleEventClick = (event: Events) => {
//     setSelectedEvent(event);
//     setIsDialogOpen(true);
//   };

//   // Get events for the selected date
//   const getEventsForDate = (date: Date | undefined) => {
//     if (!date) return [];
//     return events.filter(
//       (event) =>
//         event.date.getDate() === date.getDate() &&
//         event.date.getMonth() === date.getMonth() &&
//         event.date.getFullYear() === date.getFullYear()
//     );
//   };

//   // Get dates with events for highlighting in the calendar
//   const datesWithEvents = events.map((event) => event.date);

//   // Handle date selection from calendar
//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     setDate(selectedDate);
//     // If there's only one event on this date, open it directly
//     const eventsOnDate = getEventsForDate(selectedDate);
//     if (eventsOnDate.length === 1) {
//       handleEventClick(eventsOnDate[0]);
//     }
//   };

//   return (
//     <div className="grid gap-4 md:grid-cols-7">
//       <Card className="md:col-span-5">
//         <CardContent className="p-0">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={handleDateSelect}
//             className="rounded-md border"
//             modifiers={{
//               event: datesWithEvents,
//             }}
//             modifiersStyles={{
//               event: {
//                 fontWeight: "bold",
//                 backgroundColor: "hsl(var(--primary) / 0.1)",
//                 color: "hsl(var(--primary))",
//               },
//             }}
//           />
//         </CardContent>
//       </Card>

//       <Card className="md:col-span-2">
//         <CardContent className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-medium">
//               Events for{" "}
//               {date?.toLocaleDateString("en-US", {
//                 month: "long",
//                 day: "numeric",
//                 year: "numeric",
//               })}
//             </h3>
//           </div>

//           <ScrollArea className="h-[400px] pr-4">
//             <div className="space-y-4">
//               {isLoading ? (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <CalendarIcon className="mx-auto h-8 w-8 mb-2 opacity-50 animate-spin" />
//                   <p>Loading events...</p>
//                 </div>
//               ) : getEventsForDate(date).length > 0 ? (
//                 getEventsForDate(date).map((event) => (
//                   <div
//                     key={event.id}
//                     className="border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors"
//                     onClick={() => handleEventClick(event)}
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <h4 className="font-medium">{event.title}</h4>
//                       <Badge className={`${getEventTypeColor(event.type)}`}>
//                         {event.type.charAt(0).toUpperCase() +
//                           event.type.slice(1)}
//                       </Badge>
//                     </div>
//                     <div className="text-sm text-muted-foreground space-y-1">
//                       <div className="flex items-center">
//                         <Clock className="h-3.5 w-3.5 mr-2" />
//                         <span>
//                           {event.startTime} - {event.endTime}
//                         </span>
//                       </div>
//                       <div className="flex items-center">
//                         <MapPin className="h-3.5 w-3.5 mr-2" />
//                         <span>{event.location}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Users className="h-3.5 w-3.5 mr-2" />
//                         <span>{event.rsvps.length} attending</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <CalendarIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
//                   <p>No events scheduled for this date</p>
//                 </div>
//               )}
//             </div>
//           </ScrollArea>
//         </CardContent>
//       </Card>

//       {/* Event Details Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>{selectedEvent?.title}</DialogTitle>
//             <DialogDescription>
//               {selectedEvent?.date.toLocaleDateString("en-US", {
//                 weekday: "long",
//                 month: "long",
//                 day: "numeric",
//                 year: "numeric",
//               })}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <Badge
//                 className={`${
//                   selectedEvent ? getEventTypeColor(selectedEvent.type) : ""
//                 }`}
//               >
//                 {/* {selectedEvent?.type.charAt(0).toUpperCase() +
//                   selectedEvent?.type.slice(1)} */}
//               </Badge>
//               <Button variant="outline" size="sm" className="gap-1">
//                 <Users className="h-4 w-4" />
//                 {selectedEvent?.rsvps.length} attending
//               </Button>
//             </div>

//             <div className="space-y-2 text-sm">
//               <div className="flex items-center">
//                 <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
//                 <span>
//                   {selectedEvent?.startTime} - {selectedEvent?.endTime}
//                 </span>
//               </div>
//               <div className="flex items-center">
//                 <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
//                 <span>{selectedEvent?.location}</span>
//               </div>
//             </div>

//             <div className="border-t pt-4">
//               <h4 className="font-medium mb-2">Description</h4>
//               <p className="text-sm text-muted-foreground">
//                 {selectedEvent?.description}
//               </p>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Heart,
  HeartOff,
} from "lucide-react";
import { toast } from "sonner";
import { Events } from "@/types/events";
import { getEvents } from "@/app/(dashboards)/dashboard/events/action";

const ITEMS_PER_PAGE = 3;

export function EventsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Events[]>([]);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const result = await getEvents();
        if (!result.success) {
          toast.error(result.message || "Failed to fetch events");
          return;
        }

        const formatted = (result.data || [])
          .map((event: Events) => {
            const parsedDate = new Date(event.date);
            return isNaN(parsedDate.getTime())
              ? null
              : { ...event, date: parsedDate };
          })
          .filter(Boolean) as Events[];

        setEvents(formatted);
      } catch (err) {
        toast.error("Failed to fetch events");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  }, []);

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

  const getEventsForDate = useMemo(() => {
    if (!date) return [];
    return events.filter(
      (e) =>
        e.date.getDate() === date.getDate() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getFullYear() === date.getFullYear()
    );
  }, [date, events]);

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return getEventsForDate.slice(start, start + ITEMS_PER_PAGE);
  }, [getEventsForDate, page]);

  const totalPages = Math.ceil(getEventsForDate.length / ITEMS_PER_PAGE);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setPage(1); // Reset to first page on date change
    const list = events.filter(
      (e) =>
        e.date.getDate() === selectedDate?.getDate() &&
        e.date.getMonth() === selectedDate?.getMonth() &&
        e.date.getFullYear() === selectedDate?.getFullYear()
    );
    if (list.length === 1) handleEventClick(list[0]);
  };

  const handleEventClick = (event: Events) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const datesWithEvents = useMemo(() => events.map((e) => e.date), [events]);

  return (
    <div className="grid gap-4 md:grid-cols-7">
      {/* Calendar */}
      <Card className="md:col-span-5">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{ event: datesWithEvents }}
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

      {/* Event List */}
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">
            Events for{" "}
            {date?.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="mx-auto h-8 w-8 mb-2 animate-spin" />
                  <p>Loading events...</p>
                </div>
              ) : getEventsForDate.length > 0 ? (
                paginatedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex gap-1 items-center">
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() +
                            event.type.slice(1)}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavourite(event.id);
                          }}
                          aria-label="Toggle Favourite"
                        >
                          {favourites.has(event.id) ? (
                            <Heart className="text-red-500 w-4 h-4" />
                          ) : (
                            <HeartOff className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-2" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-2" />
                        {event.rsvps.length} attending
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="mx-auto h-8 w-8 mb-2" />
                  <p>No events scheduled for this date</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between mt-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Dialog */}
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
                className={
                  selectedEvent ? getEventTypeColor(selectedEvent.type) : ""
                }
              >
                {selectedEvent?.type}
              </Badge>
              <Button variant="outline" size="sm" className="gap-1">
                <Users className="h-4 w-4" />
                {selectedEvent?.rsvps.length} attending
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                {selectedEvent?.startTime} - {selectedEvent?.endTime}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {selectedEvent?.location}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="line-clamp-4 max-w-48 text-sm text-muted-foreground">
                {selectedEvent?.description}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
