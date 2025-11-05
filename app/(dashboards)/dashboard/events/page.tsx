import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsCalendar } from "@/components/dashboard/events-calendar";
import { EventsList } from "@/components/dashboard/events-list";
// import { MyEvents } from "@/components/dashboard/my-events";
import { Calendar, ListFilter, Bell } from "lucide-react";

// const fetchEvents = async () => {
//   setIsLoading(true);
//   try {
//     const token = await auth.currentUser?.getIdToken();
//     if (!token) {
//       toast.error("Authentication required");
//       return;
//     }

//     const result = await getEventsByUserId({ token });

//     if (!result.success) {
//       toast.error(result.message || "Failed to fetch events");
//       return;
//     }

//     if (!result.events || result.events.length === 0) {
//       toast.info("No events found");
//       setEvents([]);
//       return;
//     }

//     setEvents(result.events);
//   } catch (error) {
//     console.error("Fetch error:", error);
//     toast.error("Failed to load events");
//   } finally {
//     setIsLoading(false);
//   }
// };

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Discover and join upcoming events at masjids in your community.
          </p>
        </div>
        <Button>
          <Bell className="mr-2 h-4 w-4" />
          Notification Settings
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <ListFilter className="h-4 w-4" />
            <span>List View</span>
          </TabsTrigger>
          {/* <TabsTrigger value="my-events" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>My Events</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events Calendar</CardTitle>
              <CardDescription>
                View upcoming events in a calendar format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsCalendar />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events List</CardTitle>
              <CardDescription>
                Browse all upcoming events in a list format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="my-events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Events</CardTitle>
              <CardDescription>
                Events you&apos;re attending or interested in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyEvents />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
