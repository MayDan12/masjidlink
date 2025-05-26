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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Loader2, Lock } from "lucide-react";

const privacySettingsSchema = z.object({
  profileVisibility: z.object({
    profile: z.enum(["public", "members", "private"]),
    email: z.enum(["public", "members", "private"]),
    phone: z.enum(["public", "members", "private"]),
    location: z.enum(["public", "members", "private"]),
  }),
  communication: z.object({
    allowDirectMessages: z.boolean(),
    allowTagging: z.boolean(),
    allowFriendRequests: z.boolean(),
  }),
  dataUsage: z.object({
    allowAnalytics: z.boolean(),
    allowPersonalization: z.boolean(),
    allowLocationTracking: z.boolean(),
    allowCookies: z.boolean(),
  }),
  contentPreferences: z.object({
    hideActivity: z.boolean(),
    hideDonations: z.boolean(),
  }),
});

type PrivacySettingsValues = z.infer<typeof privacySettingsSchema>;

export function PrivacySettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Default values for the form
  const defaultValues: PrivacySettingsValues = {
    profileVisibility: {
      profile: "members",
      email: "private",
      phone: "private",
      location: "members",
    },
    communication: {
      allowDirectMessages: true,
      allowTagging: true,
      allowFriendRequests: true,
    },
    dataUsage: {
      allowAnalytics: true,
      allowPersonalization: true,
      allowLocationTracking: true,
      allowCookies: true,
    },
    contentPreferences: {
      hideActivity: false,
      hideDonations: true,
    },
  };

  const form = useForm<PrivacySettingsValues>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues,
  });

  function onSubmit(data: PrivacySettingsValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Visibility</h3>
          <p className="text-sm text-muted-foreground">
            Control who can see your profile information.
          </p>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="profileVisibility.profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Profile Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="public" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Public (Anyone can view)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="members" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Members Only (Only registered users)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Private (Only you and admins)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    This controls the overall visibility of your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileVisibility.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="public" />
                        </FormControl>
                        <FormLabel className="font-normal">Public</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="members" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Members Only
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="font-normal">Private</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileVisibility.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="public" />
                        </FormControl>
                        <FormLabel className="font-normal">Public</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="members" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Members Only
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="font-normal">Private</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileVisibility.location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="public" />
                        </FormControl>
                        <FormLabel className="font-normal">Public</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="members" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Members Only
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="font-normal">Private</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Communication Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Control how others can interact with you on the platform.
          </p>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="communication.allowDirectMessages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow Direct Messages
                    </FormLabel>
                    <FormDescription>
                      Allow other users to send you direct messages
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
              name="communication.allowTagging"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Tagging</FormLabel>
                    <FormDescription>
                      Allow other users to tag you in posts and comments
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
              name="communication.allowFriendRequests"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow Friend Requests
                    </FormLabel>
                    <FormDescription>
                      Allow other users to send you friend or connection
                      requests
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
          <h3 className="text-lg font-medium">Data Usage & Cookies</h3>
          <p className="text-sm text-muted-foreground">
            Control how your data is used and collected.
          </p>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="dataUsage.allowAnalytics"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Analytics</FormLabel>
                    <FormDescription>
                      Allow us to collect anonymous usage data to improve the
                      application
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
              name="dataUsage.allowPersonalization"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow Personalization
                    </FormLabel>
                    <FormDescription>
                      Allow us to personalize your experience based on your
                      usage
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
              name="dataUsage.allowLocationTracking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow Location Tracking
                    </FormLabel>
                    <FormDescription>
                      Allow the app to track your location for features like
                      nearby masjids
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
              name="dataUsage.allowCookies"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Cookies</FormLabel>
                    <FormDescription>
                      Allow the use of cookies to remember your preferences
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
          <h3 className="text-lg font-medium">Content Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Control what content is visible to others.
          </p>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="contentPreferences.hideActivity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Hide Activity</FormLabel>
                    <FormDescription>
                      Hide your activity history from other users
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
              name="contentPreferences.hideDonations"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Hide Donations</FormLabel>
                    <FormDescription>
                      Hide your donation history from other users
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

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Save Privacy Settings
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
