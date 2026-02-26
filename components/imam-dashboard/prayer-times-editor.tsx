"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Loader, Save } from "lucide-react";
import { saveMasjidPrayerTime } from "@/app/(dashboards)/imam/action";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { PrayerTime } from "@/types/masjid";

export function PrayerTimesEditor() {
  // Mock data - in a real app, this would come from an API
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: { time: "05:15", notification: true, bellReminder: true },
    sunrise: { time: "06:30", notification: false, bellReminder: false },
    dhuhr: { time: "12:30", notification: true, bellReminder: true },
    asr: { time: "15:45", notification: true, bellReminder: true },
    maghrib: { time: "18:15", notification: true, bellReminder: true },
    isha: { time: "19:45", notification: true, bellReminder: true },
  });
  const [loading, setLoading] = useState(false);

  const handleTimeChange = (prayer: string, time: string) => {
    setPrayerTimes((prev) => ({
      ...prev,
      [prayer]: { ...prev[prayer as keyof typeof prev], time },
    }));
  };

  const handleNotificationChange = (prayer: string, enabled: boolean) => {
    setPrayerTimes((prev) => ({
      ...prev,
      [prayer]: { ...prev[prayer as keyof typeof prev], notification: enabled },
    }));
  };

  const handleBellReminderChange = (prayer: string, enabled: boolean) => {
    setPrayerTimes((prev) => ({
      ...prev,
      [prayer]: { ...prev[prayer as keyof typeof prev], bellReminder: enabled },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const token = await auth?.currentUser?.getIdToken();
    // In a real app, this would save to an API
    console.log("Saving prayer times:", prayerTimes);
    if (!token) {
      toast.error("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const prayerTimesArray = Object.entries(prayerTimes).map(
      ([name, settings]) => ({
        name: name as PrayerTime["name"],
        time: settings.time,
      }),
    );

    // Show success message
    const result = await saveMasjidPrayerTime({
      prayerTimes: prayerTimesArray,
      token,
    });

    if (result.success) {
      toast.success(result.message || "Prayer times saved successfully.");
    } else {
      toast.error(result.message || "Failed to save prayer times.");
    }
  };

  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="mb-4 flex flex-wrap">
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="calculation">Calculation Method</TabsTrigger>
        <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
      </TabsList>

      <TabsContent value="manual" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(prayerTimes).map(([prayer, settings]) => (
            <div key={prayer} className="space-y-2 border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={`${prayer}-time`}
                  className="text-base capitalize"
                >
                  {prayer}
                </Label>
                {/* <div className="flex items-center space-x-2">
                  <Switch
                    id={`${prayer}-notification`}
                    checked={settings.notification}
                    onCheckedChange={(checked) =>
                      handleNotificationChange(prayer, checked)
                    }
                  />
                  <Label htmlFor={`${prayer}-notification`} className="text-xs">
                    Azan
                  </Label>
                </div> */}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  id={`${prayer}-time`}
                  type="time"
                  value={settings.time}
                  onChange={(e) => handleTimeChange(prayer, e.target.value)}
                  className="w-full"
                />
              </div>

              {/* <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id={`${prayer}-bell`}
                  checked={settings.bellReminder}
                  onCheckedChange={(checked) =>
                    handleBellReminderChange(prayer, checked)
                  }
                />
                <Label
                  htmlFor={`${prayer}-bell`}
                  className="text-xs flex items-center"
                >
                  <Bell className="h-3 w-3 mr-1" /> 15 min reminder
                </Label>
              </div> */}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Save Prayer Times"
            )}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="calculation" className="space-y-4">
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Calculation Method</h3>
          <p className="text-muted-foreground mb-4">
            Choose a calculation method for prayer times based on your location
            and preferences.
          </p>

          {/* Calculation method options would go here */}
          <p className="text-sm text-muted-foreground">
            This feature will be available in the next update.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="adjustments" className="space-y-4">
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Time Adjustments</h3>
          <p className="text-muted-foreground mb-4">
            Make seasonal or permanent adjustments to calculated prayer times.
          </p>

          {/* Adjustment options would go here */}
          <p className="text-sm text-muted-foreground">
            This feature will be available in the next update.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
