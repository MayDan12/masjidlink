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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  calculationMethod: z.string(),
  asrJuristic: z.enum(["Standard", "Hanafi"]),
  adjustments: z.object({
    fajr: z.string(),
    sunrise: z.string(),
    dhuhr: z.string(),
    asr: z.string(),
    maghrib: z.string(),
    isha: z.string(),
  }),
  highLatitudeMethod: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  timezone: z.string(),
});

export function PrayerTimesCalculationSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calculationMethod: "MWL",
      asrJuristic: "Standard",
      adjustments: {
        fajr: "0",
        sunrise: "0",
        dhuhr: "0",
        asr: "0",
        maghrib: "0",
        isha: "0",
      },
      highLatitudeMethod: "NightMiddle",
      latitude: "41.8781",
      longitude: "-87.6298",
      timezone: "America/Chicago",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      toast({
        title: "Calculation settings updated",
        description:
          "Your prayer times calculation settings have been successfully updated.",
      });
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="calculationMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calculation Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <FormItem className="space-y-3">
              <FormLabel>Asr Juristic Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Standard" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Standard (Shafi&apos;i, Maliki, Hanbali) - shadow length =
                      1x object height
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Hanafi" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Hanafi - shadow length = 2x object height
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="text-lg font-medium mb-2">
            Time Adjustments (minutes)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Fine-tune prayer times by adding or subtracting minutes from the
            calculated times.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="adjustments.fajr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fajr</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adjustments.sunrise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sunrise</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adjustments.dhuhr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dhuhr</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adjustments.asr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asr</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adjustments.maghrib"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maghrib</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adjustments.isha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Isha</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-2">Location Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Set your masjid&apos;s geographical location for accurate prayer
            time calculations.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="America/Anchorage">
                        Alaska Time (AKT)
                      </SelectItem>
                      <SelectItem value="Pacific/Honolulu">
                        Hawaii Time (HT)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        London (GMT/BST)
                      </SelectItem>
                      <SelectItem value="Europe/Paris">
                        Central European Time (CET)
                      </SelectItem>
                      <SelectItem value="Asia/Dubai">
                        Gulf Standard Time (GST)
                      </SelectItem>
                      <SelectItem value="Asia/Riyadh">
                        Arabia Standard Time (AST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="highLatitudeMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>High Latitude Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                latitude where twilight may not occur or last extremely long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
