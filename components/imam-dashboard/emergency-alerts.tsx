"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Loader2,
  Send,
  Trash,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  alertType: z.string().min(1, {
    message: "Alert type is required.",
  }),
  sendSMS: z.boolean().default(true),
  sendEmail: z.boolean().default(true),
  sendPush: z.boolean().default(true),
  targetGroups: z.string().min(1, {
    message: "Target group is required.",
  }),
});

type Alert = {
  id: string;
  title: string;
  content: string;
  date: string;
  alertType: string;
  channels: string[];
  sentTo: string;
};

export function EmergencyAlerts() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("create");

  // Mock alerts data
  const alerts: Alert[] = [
    {
      id: "1",
      title: "Urgent: Janazah Prayer",
      content:
        "Janazah prayer for Brother Ahmed will be held after Dhuhr prayer today.",
      date: "2023-04-20",
      alertType: "janazah",
      channels: ["SMS", "Email", "Push"],
      sentTo: "All Members",
    },
    {
      id: "2",
      title: "Weather Alert: Masjid Closed",
      content:
        "Due to severe weather conditions, the masjid will be closed today. Please stay safe.",
      date: "2023-04-15",
      alertType: "closure",
      channels: ["SMS", "Email", "Push"],
      sentTo: "All Members",
    },
    {
      id: "3",
      title: "Prayer Time Change",
      content:
        "Due to daylight saving time, all prayer times have been adjusted. Please check the updated schedule.",
      date: "2023-04-10",
      alertType: "prayer",
      channels: ["Email", "Push"],
      sentTo: "All Members",
    },
  ];

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      alertType: "",
      sendSMS: true,
      sendEmail: true,
      sendPush: true,
      targetGroups: "all",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      form.reset();
      toast({
        title: "Emergency alert sent",
        description:
          "Your emergency alert has been sent to the selected recipients.",
      });
    }, 1500);
  }

  // Get alert type badge color
  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "janazah":
        return "bg-gray-100 text-gray-800";
      case "closure":
        return "bg-red-100 text-red-800";
      case "prayer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <Tabs
      defaultValue={selectedTab}
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="create">Create Alert</TabsTrigger>
        <TabsTrigger value="history">Alert History</TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Emergency Alert</CardTitle>
            <CardDescription>
              Emergency alerts will be sent immediately to all selected
              recipients via the chosen channels.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">
                      Important Notice
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Emergency alerts should only be used for urgent matters
                      that require immediate attention from community members.
                      Overuse may cause recipients to ignore future alerts.
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter alert title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Keep the title clear and concise.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter alert content"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide all necessary details. For SMS, keep it under
                        160 characters if possible.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alertType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select alert type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="janazah">
                            Janazah Prayer
                          </SelectItem>
                          <SelectItem value="closure">
                            Masjid Closure
                          </SelectItem>
                          <SelectItem value="prayer">
                            Prayer Time Change
                          </SelectItem>
                          <SelectItem value="event">Event Change</SelectItem>
                          <SelectItem value="other">Other Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3">
                    Notification Channels
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="sendSMS"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>SMS</FormLabel>
                            <FormDescription>
                              Send text messages
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
                      name="sendEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Email</FormLabel>
                            <FormDescription>Send email alerts</FormDescription>
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
                      name="sendPush"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Push Notification</FormLabel>
                            <FormDescription>
                              Send app notifications
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

                <FormField
                  control={form.control}
                  name="targetGroups"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Recipients</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipients" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Members</SelectItem>
                          <SelectItem value="committee">
                            Committee Members
                          </SelectItem>
                          <SelectItem value="volunteers">Volunteers</SelectItem>
                          <SelectItem value="custom">Custom Group</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Alert...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Emergency Alert
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Alert History</CardTitle>
            <CardDescription>
              View all emergency alerts that have been sent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-red-500" />
                        <h3 className="font-medium">{alert.title}</h3>
                      </div>
                      <Badge className={getAlertTypeColor(alert.alertType)}>
                        {alert.alertType.charAt(0).toUpperCase() +
                          alert.alertType.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {alert.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {alert.channels.map((channel) => (
                        <Badge key={channel} variant="outline">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>Sent: {formatDate(alert.date)}</span>
                      </div>
                      <div>Sent to: {alert.sentTo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              Export History
            </Button>
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
