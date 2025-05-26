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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save } from "lucide-react";

const formSchema = z.object({
  calculationMethod: z.string(),
  asrJuristic: z.enum(["Standard", "Hanafi"]),
  highLatitudeMethod: z.string(),
  notifications: z.object({
    beforePrayer: z.boolean(),
    atPrayer: z.boolean(),
    jumuah: z.boolean(),
    specialEvents: z.boolean(),
  }),
  adjustments: z.object({
    fajr: z.number(),
    sunrise: z.number(),
    dhuhr: z.number(),
    asr: z.number(),
    maghrib: z.number(),
    isha: z.number(),
  }),
});

export function PrayerTimeSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calculationMethod: "MWL",
      asrJuristic: "Standard",
      highLatitudeMethod: "NightMiddle",
      notifications: {
        beforePrayer: true,
        atPrayer: true,
        jumuah: true,
        specialEvents: true,
      },
      adjustments: {
        fajr: 0,
        sunrise: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Calculation Method</h3>
          <FormField
            control={form.control}
            name="calculationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prayer Time Calculation Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select calculation method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MWL">Muslim World League</SelectItem>
                    <SelectItem value="ISNA">
                      Islamic Society of North America (ISNA)
                    </SelectItem>
                    <SelectItem value="Egypt">
                      Egyptian General Authority of Survey
                    </SelectItem>
                    <SelectItem value="Makkah">
                      Umm al-Qura University, Makkah
                    </SelectItem>
                    <SelectItem value="Karachi">
                      University of Islamic Sciences, Karachi
                    </SelectItem>
                    <SelectItem value="Tehran">
                      Institute of Geophysics, University of Tehran
                    </SelectItem>
                    <SelectItem value="Jafari">
                      Shia Ithna-Ashari, Leva Institute, Qum
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The calculation method used to determine prayer times based on
                  geographical location.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asrJuristic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asr Juristic Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Asr calculation method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Standard">
                      Standard (Shafi&apos;i, Maliki, Hanbali)
                    </SelectItem>
                    <SelectItem value="Hanafi">Hanafi</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Standard: shadow length = 1x object height, Hanafi: shadow
                  length = 2x object height
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highLatitudeMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>High Latitude Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select high latitude method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NightMiddle">Middle of Night</SelectItem>
                    <SelectItem value="AngleBased">Angle Based</SelectItem>
                    <SelectItem value="OneSeventh">1/7th of Night</SelectItem>
                    <SelectItem value="None">None (No Adjustment)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Method for calculating Fajr and Isha in locations at high
                  latitude.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>

          <FormField
            control={form.control}
            name="notifications.beforePrayer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Before Prayer Reminder
                  </FormLabel>
                  <FormDescription>
                    Receive a notification 15 minutes before each prayer time
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
            name="notifications.atPrayer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">At Prayer Time</FormLabel>
                  <FormDescription>
                    Receive a notification at the exact prayer time
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
            name="notifications.jumuah"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Jumu&apos;ah Reminder
                  </FormLabel>
                  <FormDescription>
                    Receive a notification for Friday prayer
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
            name="notifications.specialEvents"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Special Events</FormLabel>
                  <FormDescription>
                    Receive notifications for Eid, Ramadan, and other special
                    occasions
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
