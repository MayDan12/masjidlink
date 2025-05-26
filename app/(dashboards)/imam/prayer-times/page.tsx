import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrayerTimesEditor } from "@/components/imam-dashboard/prayer-times-editor";
import { PrayerTimesCalculationSettings } from "@/components/imam-dashboard/prayer-times-calculation-settings";
import { JumuahSettings } from "@/components/imam-dashboard/jumuah-settings";
import { RamadanSettings } from "@/components/imam-dashboard/ramadan-settings";

export default function PrayerTimesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prayer Times</h1>
        <p className="text-muted-foreground">
          Manage prayer times, calculation methods, and special prayer schedules
          for your masjid.
        </p>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Prayers</TabsTrigger>
          <TabsTrigger value="jumuah">Jumu&apos;ah</TabsTrigger>
          <TabsTrigger value="calculation">Calculation Method</TabsTrigger>
          <TabsTrigger value="ramadan">Ramadan</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Prayer Times</CardTitle>
              <CardDescription>
                Set and adjust the five daily prayer times for your masjid.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrayerTimesEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jumuah" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jumu&apos;ah Prayer Settings</CardTitle>
              <CardDescription>
                Configure Jumu&apos;ah prayer times and khutbah details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JumuahSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calculation Method</CardTitle>
              <CardDescription>
                Choose a calculation method for prayer times based on your
                location.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrayerTimesCalculationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ramadan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ramadan Schedule</CardTitle>
              <CardDescription>
                Set special prayer times and schedules for Ramadan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RamadanSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
