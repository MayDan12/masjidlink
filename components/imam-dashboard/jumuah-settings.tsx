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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  khutbahTime: z.string(),
  prayerTime: z.string(),
  language: z.string(),
  secondLanguage: z.string().optional(),
  hasTranslation: z.boolean(),
  khatib: z.string(),
  additionalInfo: z.string().optional(),
  multipleServices: z.boolean(),
  secondServiceTime: z.string().optional(),
});

export function JumuahSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      khutbahTime: "13:15",
      prayerTime: "13:45",
      language: "English",
      secondLanguage: "Arabic",
      hasTranslation: true,
      khatib: "Imam Abdullah",
      additionalInfo:
        "Please arrive early as the prayer hall fills up quickly.",
      multipleServices: false,
      secondServiceTime: "",
    },
  });

  const multipleServices = form.watch("multipleServices");

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      toast({
        title: "Jumu'ah settings updated",
        description:
          "Your Jumu'ah prayer settings have been successfully updated.",
      });
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="khutbahTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khutbah Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>
                  The time when the khutbah (sermon) begins.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prayerTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prayer Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>
                  The time when the Jumu&apos;ah prayer begins.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="Urdu">Urdu</SelectItem>
                    <SelectItem value="Turkish">Turkish</SelectItem>
                    <SelectItem value="Somali">Somali</SelectItem>
                    <SelectItem value="Farsi">Farsi</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The main language used for the khutbah.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Language (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select secondary language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="Urdu">Urdu</SelectItem>
                    <SelectItem value="Turkish">Turkish</SelectItem>
                    <SelectItem value="Somali">Somali</SelectItem>
                    <SelectItem value="Farsi">Farsi</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  A secondary language used during the khutbah, if applicable.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="hasTranslation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Translation Available
                </FormLabel>
                <FormDescription>
                  Is translation available for non-native speakers?
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
          name="khatib"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regular Khatib (Speaker)</FormLabel>
              <FormControl>
                <Input placeholder="Enter name of regular khatib" {...field} />
              </FormControl>
              <FormDescription>
                The name of the regular imam or speaker who delivers the
                khutbah.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="multipleServices"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Multiple Jumu&apos;ah Services
                </FormLabel>
                <FormDescription>
                  Does your masjid offer multiple Jumu&apos;ah services?
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

        {multipleServices && (
          <FormField
            control={form.control}
            name="secondServiceTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Second Service Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>
                  The time when the second Jumu&apos;ah service begins.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional information about Jumu'ah prayers"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any additional information that attendees should know about
                Jumu&apos;ah prayers.
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
