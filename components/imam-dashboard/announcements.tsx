"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertCircle, Loader, Send } from "lucide-react";
import { auth } from "@/firebase/client";
import { createAnnouncements } from "@/app/(dashboards)/imam/announcements/action";
import { toast } from "sonner";

// Form schema with validation
const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100),
  content: z
    .string()
    .min(10, { message: "Please provide more detailed information" }),
  isEmergency: z.boolean().default(false),
  type: z
    .string()
    .min(3, { message: "Please provide more detailed information" }),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
});

type FormSchemaInput = z.input<typeof formSchema>; // this is the correct input type

export function AnnouncementEditor() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormSchemaInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      isEmergency: false,
      type: "",
      severity: "medium",
    },
  });

  // Watch the isEmergency field to conditionally render severity
  const isEmergency = form.watch("isEmergency");

  const onSubmit = async (values: FormSchemaInput) => {
    setIsLoading(true); // Set loading state
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        console.error("User not authenticated");
        return;
      }
      // Call the server action to create an announcement

      const result = await createAnnouncements({ ...values, token }); // Handle form submission
      if (result.success) {
        toast("Saved Successfully", {
          description: "Announcement created successfully.",
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        });

        form.reset({
          title: "",
          content: "",
          isEmergency: false,
          type: "",
          severity: "medium",
        });
      } else {
        toast("Error", {
          description: result.message || "An error occurred while saving.",
        });
      }
      console.log(values);
      // Reset form
    } catch (error) {
      console.error("Error submitting form:", error);
      return;
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 border p-4 rounded-lg"
        >
          <h3 className="text-lg font-medium">Create New Announcement</h3>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Announcement Title*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter announcement title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Announcement Details*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide full details of the announcement"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announcement Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter announcement type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEmergency && (
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="isEmergency"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-destructive" />
                    Emergency Announcement
                  </FormLabel>
                  <FormDescription>
                    Emergency alerts will trigger push notifications and appear
                    as banners
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {isLoading ? (
              <span className="flex items-center">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Announcing
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                {isEmergency
                  ? "Broadcast Emergency Announcement"
                  : "Publish Announcement"}
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
