"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { createEvents } from "@/app/(dashboards)/imam/events/action";

// Define types for form data
type EventType = "lecture" | "janazah" | "iftar" | "class" | "other";
type RecurringFrequency = "daily" | "weekly" | "monthly";

interface FormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  type: EventType | "";
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency | "";
  isPublic: boolean;
  maxAttendees?: string;
  enableDonations: boolean; // Toggle for donation features
}

// Define types for form errors
interface FormError {
  message: string;
}

interface FormErrors {
  title?: FormError;
  description?: FormError;
  date?: FormError;
  startTime?: FormError;
  endTime?: FormError;
  location?: FormError;
  type?: FormError;
  isRecurring?: FormError;
  recurringFrequency?: FormError;
  isPublic?: FormError;
  maxAttendees?: FormError;
  // enableDonations: FormError;
}

// Create a validation function
const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.title || data.title.length < 2) {
    errors.title = { message: "Title must be at least 2 characters." };
  }

  if (!data.description || data.description.length < 10) {
    errors.description = {
      message: "Description must be at least 10 characters.",
    };
  }

  if (!data.date) {
    errors.date = { message: "Date is required." };
  }

  if (!data.startTime) {
    errors.startTime = { message: "Start time is required." };
  }

  if (!data.location || data.location.length < 2) {
    errors.location = { message: "Location is required." };
  }

  if (!data.type) {
    errors.type = { message: "Event type is required." };
  }

  if (data.isRecurring && !data.recurringFrequency) {
    errors.recurringFrequency = {
      message: "Frequency is required for recurring events.",
    };
  }

  return errors;
};

export function CreateEvent() {
  const [isLoading, setIsLoading] = useState(false);

  // Use our types with react-hook-form
  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "",
      isRecurring: false,
      recurringFrequency: "",
      isPublic: true,
      maxAttendees: "",
      enableDonations: false,
    },
  });

  const isRecurring = form.watch("isRecurring");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Manual validation
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([key, value]) => {
        form.setError(key as keyof FormData, {
          type: "manual",
          message: value,
        });
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        toast("Error", {
          description: "Unable to retrieve authentication token.",
        });
        return;
      }

      const response = await createEvents({ ...data, token });

      if (response.success) {
        toast("Event Created", {
          description: "Event successfully created.",
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        });
      } else {
        toast("Error", {
          description: response.message || "An error occurred while saving.",
        });
      }

      console.log(response);
    } catch (error) {
      console.error("Submit Error:", error);
      toast("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time (Optional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lecture">Lecture</SelectItem>
                      <SelectItem value="janazah">Janazah</SelectItem>
                      <SelectItem value="iftar">Iftar</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="enableDonations"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Enable Donations</FormLabel>
                  <FormDescription>
                    Allow viewers to donate during the livestream.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Recurring Event</FormLabel>
                    <FormDescription>
                      Does this event repeat on a schedule?
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

            {isRecurring && (
              <FormField
                control={form.control}
                name="recurringFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Public Event</FormLabel>
                    <FormDescription>
                      Make this event visible to everyone?
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
              name="maxAttendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Attendees (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Leave blank for unlimited"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Set a limit for the number of attendees.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Event</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
