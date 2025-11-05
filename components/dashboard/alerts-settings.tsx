"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Volume2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const alertsSettingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
    inApp: z.boolean(),
  }),
  alertTypes: z.object({
    emergency: z.boolean(),
    weather: z.boolean(),
    schedule: z.boolean(),
    safety: z.boolean(),
    health: z.boolean(),
    facility: z.boolean(),
    community: z.boolean(),
  }),
  settings: z.object({
    alertSound: z.boolean(),
    alertVolume: z.number(),
    priority: z.enum(["high", "normal", "low"]),
    quietHours: z.boolean(),
    quietHoursStart: z.string().optional(),
    quietHoursEnd: z.string().optional(),
    alwaysAlertEmergency: z.boolean(),
  }),
});

type AlertsSettingsValues = z.infer<typeof alertsSettingsSchema>;

export function AlertsSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [testSound, setTestSound] = useState(false);

  // Default values for the form
  const defaultValues: AlertsSettingsValues = {
    notifications: {
      email: true,
      push: true,
      sms: true,
      inApp: true,
    },
    alertTypes: {
      emergency: true,
      weather: true,
      schedule: true,
      safety: true,
      health: true,
      facility: false,
      community: true,
    },
    settings: {
      alertSound: true,
      alertVolume: 80,
      priority: "high",
      quietHours: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "06:00",
      alwaysAlertEmergency: true,
    },
  };

  const form = useForm<AlertsSettingsValues>({
    resolver: zodResolver(alertsSettingsSchema),
    defaultValues,
  });

  function onSubmit(data: AlertsSettingsValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
    }, 1500);
  }

  const watchQuietHours = form.watch("settings.quietHours");
  const watchAlertSound = form.watch("settings.alertSound");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Channels</h3>
          <p className="text-sm text-muted-foreground">
            Choose how you&apos;d like to receive emergency alerts.
          </p>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="notifications.email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Alerts</FormLabel>
                    <FormDescription>Receive alerts via email</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications.push"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Push Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive alerts on your device
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications.sms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">SMS Alerts</FormLabel>
                    <FormDescription>
                      Receive alerts via text message
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications.inApp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">In-App Alerts</FormLabel>
                    <FormDescription>
                      Show alerts within the app
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Alert Types</h3>
          <p className="text-sm text-muted-foreground">
            Choose which types of alerts you want to receive.
          </p>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="alertTypes.emergency"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-red-100 bg-red-50 p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-base text-red-700">
                        Emergency Alerts
                      </FormLabel>
                    </div>
                    <FormDescription className="text-red-600/80">
                      Critical safety alerts that require immediate attention
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertTypes.weather"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Weather Alerts</FormLabel>
                    <FormDescription>
                      Severe weather warnings affecting the masjid or community
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertTypes.schedule"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Schedule Change Alerts
                    </FormLabel>
                    <FormDescription>
                      Updates to prayer times, events, or masjid hours
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertTypes.safety"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Safety Alerts</FormLabel>
                    <FormDescription>
                      Information about safety concerns in or around the masjid
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertTypes.health"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Health Alerts</FormLabel>
                    <FormDescription>
                      Health advisories or important medical information
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertTypes.facility"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Facility Alerts</FormLabel>
                    <FormDescription>
                      Updates about facilities, maintenance, or closures
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertTypes.community"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Community Alerts
                    </FormLabel>
                    <FormDescription>
                      Important community-wide announcements
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* <div className="space-y-4">
          <h3 className="text-lg font-medium">Alert Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Customize how and when you receive alerts.
          </p>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="settings.alertSound"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Alert Sound</FormLabel>
                    <FormDescription>
                      Play a sound when you receive an alert
                    </FormDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {watchAlertSound && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setTestSound(true)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {watchAlertSound && (
              <FormField
                control={form.control}
                name="settings.alertVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alert Volume</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <FormDescription>Low</FormDescription>
                      <FormDescription>High</FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="settings.priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">
                        High (Show immediately)
                      </SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low (Can be batched)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How alerts should be prioritized on your device
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settings.quietHours"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Quiet Hours</FormLabel>
                    <FormDescription>
                      Do not disturb during specific hours
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {watchQuietHours && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="settings.quietHoursStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <input
                          type="time"
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="settings.quietHoursEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <input
                          type="time"
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="settings.alwaysAlertEmergency"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-red-100 bg-red-50 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base text-red-700">
                      Always Alert for Emergencies
                    </FormLabel>
                    <FormDescription className="text-red-600/80">
                      Always receive emergency alerts, even during quiet hours
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div> */}

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Alert Settings
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
