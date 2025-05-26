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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  taraweehTime: z.string(),
  taraweehEnabled: z.boolean(),
  iftar: z.object({
    dailyIftar: z.boolean(),
    iftarTime: z.string().optional(),
    iftarDetails: z.string().optional(),
  }),
  suhoor: z.object({
    suhoorEnabled: z.boolean(),
    suhoorTime: z.string().optional(),
    suhoorDetails: z.string().optional(),
  }),
  additionalInfo: z.string().optional(),
});

export function RamadanSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taraweehTime: "21:30",
      taraweehEnabled: true,
      iftar: {
        dailyIftar: true,
        iftarTime: "19:45",
        iftarDetails:
          "Community iftar is served daily in the main hall. Please arrive 15 minutes early.",
      },
      suhoor: {
        suhoorEnabled: false,
        suhoorTime: "",
        suhoorDetails: "",
      },
      additionalInfo:
        "Qur'an recitation sessions will be held daily after Asr prayer during Ramadan.",
    },
  });

  const taraweehEnabled = form.watch("taraweehEnabled");
  const dailyIftar = form.watch("iftar.dailyIftar");
  const suhoorEnabled = form.watch("suhoor.suhoorEnabled");

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      toast({
        title: "Ramadan settings updated",
        description:
          "Your Ramadan prayer and event settings have been successfully updated.",
      });
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Taraweeh Prayer</h3>
          <FormField
            control={form.control}
            name="taraweehEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Taraweeh Prayer</FormLabel>
                  <FormDescription>
                    Will your masjid offer Taraweeh prayers during Ramadan?
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

          {taraweehEnabled && (
            <FormField
              control={form.control}
              name="taraweehTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taraweeh Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>
                    The time when Taraweeh prayers begin each night.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-2">Iftar (Breaking Fast)</h3>
          <FormField
            control={form.control}
            name="iftar.dailyIftar"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Daily Community Iftar
                  </FormLabel>
                  <FormDescription>
                    Will your masjid offer daily iftar meals during Ramadan?
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

          {dailyIftar && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="iftar.iftarTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Iftar Serving Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      The time when iftar meals will be served.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iftar.iftarDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Iftar Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter details about iftar arrangements"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional information about iftar arrangements, such as
                      location, registration requirements, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-2">Suhoor (Pre-dawn Meal)</h3>
          <FormField
            control={form.control}
            name="suhoor.suhoorEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Community Suhoor</FormLabel>
                  <FormDescription>
                    Will your masjid offer suhoor meals during Ramadan?
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

          {suhoorEnabled && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="suhoor.suhoorTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suhoor Serving Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      The time when suhoor meals will be served.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="suhoor.suhoorDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suhoor Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter details about suhoor arrangements"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional information about suhoor arrangements, such as
                      location, registration requirements, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <Separator />

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Ramadan Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional information about Ramadan activities"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any additional information about special Ramadan activities,
                such as Qur&apos;an recitation sessions, lectures, etc.
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
