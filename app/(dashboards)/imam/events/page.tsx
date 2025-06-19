import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventCalendar } from "@/components/imam-dashboard/event-calendar";
import { EventsList } from "@/components/imam-dashboard/events-list";
// import { EventCategoriesManager } from "@/components/imam-dashboard/event-categories-manager";
import { CreateEvent } from "@/components/imam-dashboard/create-event";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Create and manage events, programs, and activities for your masjid
            community.
          </p>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="event">Create Event</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
              <CardDescription>
                View and manage all upcoming events in a calendar view.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventCalendar />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events List</CardTitle>
              <CardDescription>
                View and manage all events in a list format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="event" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
              <CardDescription>
                Fill in the details to create a new event for your community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateEvent />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
