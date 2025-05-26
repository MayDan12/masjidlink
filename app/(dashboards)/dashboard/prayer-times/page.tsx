import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrayerTimesDisplay } from "@/components/dashboard/prayer-times-display";
import { NearbyMasjids } from "@/components/dashboard/nearby-masjids";
import { PrayerTimeSettings } from "@/components/dashboard/prayer-time-settings";
import { QiblaFinder } from "@/components/dashboard/qibla-finder";

export default function PrayerTimesPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prayer Times</h1>
        <p className="text-muted-foreground">
          View prayer times for your local masjid and customize your
          notification preferences.
        </p>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Prayer Times</CardTitle>
                <CardDescription>
                  Today&apos;s prayer times for your selected masjid.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PrayerTimesDisplay />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Qibla Direction</CardTitle>
                <CardDescription>
                  Find the direction of the Qibla from your location.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QiblaFinder />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nearby Masjids</CardTitle>
              <CardDescription>
                Find masjids near your current location.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NearbyMasjids />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Prayer Schedule</CardTitle>
              <CardDescription>
                View prayer times for the entire week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrayerTimesDisplay view="weekly" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Prayer Schedule</CardTitle>
              <CardDescription>
                View prayer times for the entire month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrayerTimesDisplay view="monthly" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prayer Time Settings</CardTitle>
              <CardDescription>
                Customize your prayer time calculation method and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrayerTimeSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
