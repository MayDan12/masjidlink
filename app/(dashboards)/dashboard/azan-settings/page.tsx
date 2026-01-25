import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AzanNotificationSettings } from "@/components/dashboard/azan-notification-settings";
import { AzanSoundSettings } from "@/components/dashboard/azan-sound-settings";
// import { AzanScheduleSettings } from "@/components/dashboard/azan-schedule-settings";
import { Bell, Volume2 } from "lucide-react";

export default function AzanSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Azan Settings</h1>
        <p className="text-muted-foreground">
          Customize your azan notifications, sounds, and schedule preferences.
        </p>
      </div>

      <Tabs defaultValue="sounds" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sounds" className="flex items-center gap-1">
            <Volume2 className="h-4 w-4" />
            <span>Sounds</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-1"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>

          {/* <TabsTrigger value="schedule" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Schedule</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive azan notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AzanNotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sounds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Azan Sounds</CardTitle>
              <CardDescription>
                Choose your preferred azan recitation and volume settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AzanSoundSettings />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Settings</CardTitle>
              <CardDescription>
                Customize pre-azan reminders and prayer time adjustments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AzanScheduleSettings />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
