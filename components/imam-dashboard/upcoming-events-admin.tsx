"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  MoreHorizontal,
  Trash,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function UpcomingEventsAdmin() {
  // Mock data - in a real app, this would come from an API
  const events = [
    {
      id: "1",
      title: "Friday Khutbah: Patience in Hardship",
      date: "Friday, Apr 26",
      time: "1:00 PM",
      location: "Main Prayer Hall",
      attendees: 120,
      type: "lecture",
    },
    {
      id: "2",
      title: "Community Iftar",
      date: "Saturday, Apr 27",
      time: "7:30 PM",
      location: "Community Center",
      attendees: 85,
      type: "iftar",
    },
    {
      id: "3",
      title: "Janazah Prayer for Brother Ahmed",
      date: "Sunday, Apr 28",
      time: "10:00 AM",
      location: "Main Prayer Hall",
      attendees: 45,
      type: "janazah",
    },
  ];

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

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{event.title}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`${getEventTypeColor(event.type)}`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
        </div>
      ))}

      <div className="flex justify-center">
        <Button variant="link" size="sm">
          View All Events
        </Button>
      </div>
    </div>
  );
}
