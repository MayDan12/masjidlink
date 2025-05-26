import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/imam-dashboard/dashboard-header";
import { DonationStats } from "@/components/imam-dashboard/donation-stats";
import { PrayerTimesEditor } from "@/components/imam-dashboard/prayer-times-editor";
import { RecentDonations } from "@/components/imam-dashboard/recent-donations";
import { UpcomingEventsAdmin } from "@/components/imam-dashboard/upcoming-events";
// import { AnnouncementEditor } from "@/components/imam-dashboard/announcements";

export default function ImamDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Dashboard"
        text="Manage your masjid profile, prayer times, events, and donations."
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="prayer-times">Prayer Times</TabsTrigger>
          {/* <TabsTrigger value="announcements">Announcements</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DonationStats />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>
                  View your most recent donations and donor information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentDonations />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Manage your upcoming events and activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingEventsAdmin />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation Management</CardTitle>
              <CardDescription>
                View and manage all donations to your masjid.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentDonations showAll />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prayer-times" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prayer Times Settings</CardTitle>
              <CardDescription>
                Set and adjust prayer times for your masjid.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrayerTimesEditor />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>
                Create and manage announcements for your community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnouncementEditor />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
