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
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save } from "lucide-react";

const formSchema = z.object({
  notificationsEnabled: z.boolean(),
  notificationTypes: z.object({
    beforePrayer: z.boolean(),
    atPrayer: z.boolean(),
    jumuah: z.boolean(),
  }),
  reminderTime: z.number(),
  notificationSound: z.string(),
  vibration: z.boolean(),
  doNotDisturb: z.object({
    enabled: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});

export function AzanNotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationsEnabled: true,
      notificationTypes: {
        beforePrayer: true,
        atPrayer: true,
        jumuah: true,
      },
      reminderTime: 15,
      notificationSound: "default",
      vibration: true,
      doNotDisturb: {
        enabled: false,
        startTime: "22:00",
        endTime: "06:00",
      },
    },
  });

  const notificationsEnabled = form.watch("notificationsEnabled");
  const doNotDisturbEnabled = form.watch("doNotDisturb.enabled");

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
        <FormField
          control={form.control}
          name="notificationsEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Enable Notifications
                </FormLabel>
                <FormDescription>
                  Receive notifications for prayer times and important events
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

        {notificationsEnabled && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Types</h3>

              <FormField
                control={form.control}
                name="notificationTypes.beforePrayer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Before Prayer Reminder
                      </FormLabel>
                      <FormDescription>
                        Receive a notification before each prayer time
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
                name="notificationTypes.atPrayer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        At Prayer Time
                      </FormLabel>
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
                name="notificationTypes.jumuah"
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
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Reminder Settings</h3>

              <FormField
                control={form.control}
                name="reminderTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder Time (minutes before prayer)</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Slider
                          min={5}
                          max={30}
                          step={5}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>5 min</span>
                          <span>10 min</span>
                          <span>15 min</span>
                          <span>20 min</span>
                          <span>25 min</span>
                          <span>30 min</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Set how many minutes before prayer time you want to
                      receive a reminder
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationSound"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Sound</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select notification sound" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="adhan1">Adhan 1</SelectItem>
                        <SelectItem value="adhan2">Adhan 2</SelectItem>
                        <SelectItem value="beep">Beep</SelectItem>
                        <SelectItem value="silent">Silent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the sound that plays when you receive a
                      notification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vibration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Vibration</FormLabel>
                      <FormDescription>
                        Enable vibration for notifications
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

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Do Not Disturb</h3>

              <FormField
                control={form.control}
                name="doNotDisturb.enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Do Not Disturb
                      </FormLabel>
                      <FormDescription>
                        Silence notifications during specific hours
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

              {doNotDisturbEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="doNotDisturb.startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <input
                            type="time"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doNotDisturb.endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <input
                            type="time"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </>
        )}

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
