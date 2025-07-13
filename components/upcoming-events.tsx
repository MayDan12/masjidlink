// "use client";

// import { useEffect, useState, useCallback } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar, Clock, MapPin, Users } from "lucide-react";
// import Link from "next/link";
// import { getEvents } from "@/app/(dashboards)/dashboard/events/action";
// import { Event } from "@/types/events";

// // Memoize the event type color mapping
// const EVENT_TYPE_COLORS = {
//   lecture: "bg-blue-100 text-blue-800",
//   janazah: "bg-gray-100 text-gray-800",
//   iftar: "bg-green-100 text-green-800",
//   default: "bg-purple-100 text-purple-800",
// } as const;

// export function UpcomingEvents() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Memoized event type badge color getter
//   const getEventTypeColor = useCallback((type: Event["type"]) => {
//     return EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.default;
//   }, []);

//   // Memoized date formatter
//   const formatDate = useCallback((dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   }, []);

//   // Fetch events with error handling
//   const fetchEvents = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await getEvents();
//       if (response.data) {
//         setEvents(response.data.slice(0, 2));
//       }
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchEvents();
//   }, [fetchEvents]);

//   // Event card component to prevent re-rendering all cards when one changes
//   const EventCard = useCallback(
//     ({ event }: { event: Event }) => (
//       <div className="border rounded-lg p-4">
//         <div className="flex justify-between items-start">
//           <h3 className="font-semibold">{event.title}</h3>
//           <span
//             className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(
//               event.type
//             )}`}
//           >
//             {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
//           </span>
//         </div>
//         <div className="mt-2 space-y-1 text-sm text-muted-foreground">
//           <div className="flex items-center">
//             <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
//             <span>{formatDate(event.date)}</span>
//           </div>
//           <div className="flex items-center">
//             <Clock className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
//             <span>{event.startTime}</span>
//           </div>
//           <div className="flex items-center">
//             <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
//             <span>{event.location}</span>
//           </div>
//           <div className="flex items-center">
//             <Users className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
//             <span>{event.rsvps.length} attending</span>
//           </div>
//         </div>
//         <div className="mt-3 flex justify-end">
//           <Button size="sm" variant="outline" asChild>
//             <Link href={`/events/${event.id}`}>View Details</Link>
//           </Button>
//         </div>
//       </div>
//     ),
//     [getEventTypeColor, formatDate]
//   );

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Upcoming Events</CardTitle>
//         <CardDescription>Community events and gatherings</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="space-y-4">
//             {[...Array(2)].map((_, i) => (
//               <div key={i} className="border rounded-lg p-4">
//                 <div className="flex justify-between items-start">
//                   <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
//                   <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
//                 </div>
//                 <div className="mt-3 space-y-2">
//                   {[...Array(4)].map((_, j) => (
//                     <div key={j} className="flex items-center">
//                       <div className="h-3.5 w-3.5 mr-2 bg-muted rounded-full animate-pulse" />
//                       <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-3 flex justify-end">
//                   <div className="h-8 w-24 bg-muted rounded animate-pulse" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : events.length > 0 ? (
//           <div className="space-y-4">
//             {events.map((event) => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-4 text-muted-foreground">
//             No upcoming events
//           </div>
//         )}
//         <div className="mt-4 text-center">
//           <Button variant="link" asChild>
//             <Link href="/dashboard/events">View All Events</Link>
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
import { getEvents } from "@/app/(dashboards)/dashboard/events/action";
import { Event } from "@/types/events";
import { memo } from "react";

// Memoized event type color mapping
const EVENT_TYPE_COLORS: Record<string, string> = {
  lecture: "bg-blue-100 text-blue-800",
  janazah: "bg-gray-100 text-gray-800",
  iftar: "bg-green-100 text-green-800",
  default: "bg-purple-100 text-purple-800",
} as const;

// Skeleton loader component
const EventSkeleton = () => (
  <div className="border rounded-lg p-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="h-6 w-3/4 bg-muted rounded" />
      <div className="h-6 w-16 bg-muted rounded-full" />
    </div>
    <div className="mt-3 space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="h-3.5 w-3.5 mr-2 bg-muted rounded-full" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      ))}
    </div>
    <div className="mt-3 flex justify-between">
      <div className="h-8 w-24 bg-muted rounded" />
      <div className="h-8 w-24 bg-muted rounded" />
    </div>
  </div>
);

// Memoized EventCard component
const EventCard = memo(({ event }: { event: Event }) => {
  const getEventTypeColor = useCallback(
    (type: Event["type"]) =>
      EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.default,
    []
  );

  const formatDate = useCallback(
    (dateString: string) =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateString)),
    []
  );

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-base">{event.title}</h3>
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
          <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
          <span>{event.startTime}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
          <span>{event.rsvps.length} attending</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between">
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
        <Button
          size="sm"
          variant="outline"
          asChild
          aria-label={`View details for ${event.title}`}
        >
          <Link href={`/dashboard/events/${event.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
});

// Add display name for better debugging
EventCard.displayName = "EventCard";

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events with error handling
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getEvents();
      if (response.data) {
        setEvents(response.data);
      } else {
        setError("No events found");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Memoize sliced events to prevent unnecessary computation
  const displayedEvents = useMemo(() => events.slice(0, 2), [events]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Community events and gatherings</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4" aria-live="polite">
            {[...Array(2)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-600" aria-live="polite">
            {error}
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="space-y-4" aria-live="polite">
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-4 text-muted-foreground"
            aria-live="polite"
          >
            No upcoming events
          </div>
        )}
        <div className="mt-4 text-center">
          <Button variant="link" asChild aria-label="View all community events">
            <Link href="/dashboard/events">View All Events</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
