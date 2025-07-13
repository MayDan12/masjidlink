"use client";

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DropdownMenu } from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Mail,
  Clock,
  Search,
  Filter,
  Trash,
  Archive,
  Star,
} from "lucide-react";

type Message = {
  id: string;
  subject: string;
  content: string;
  recipients: string;
  date: string;
  status: "sent" | "draft" | "scheduled";
  starred?: boolean;
};

export function MessageCenter() {
  const [selectedTab, setSelectedTab] = useState("compose");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Mock messages data
  const messages: Message[] = [
    {
      id: "1",
      subject: "Friday Prayer Time Change",
      content:
        "Dear community members, please note that starting next week, Friday prayers will begin at 1:30 PM instead of 1:15 PM.",
      recipients: "All Members",
      date: "2023-04-20",
      status: "sent",
      starred: true,
    },
    {
      id: "2",
      subject: "Ramadan Schedule",
      content:
        "Assalamu alaikum, please find attached the complete schedule for Ramadan, including taraweeh prayers and iftar times.",
      recipients: "All Members",
      date: "2023-04-15",
      status: "sent",
    },
    {
      id: "3",
      subject: "Volunteer Opportunity",
      content:
        "We are looking for volunteers to help with the upcoming Eid festival. Please reply if you are interested in helping.",
      recipients: "Volunteers",
      date: "2023-04-10",
      status: "sent",
    },
    {
      id: "4",
      subject: "Donation Receipt",
      content:
        "Thank you for your generous donation. Please find attached your receipt for tax purposes.",
      recipients: "Donors",
      date: "2023-04-05",
      status: "sent",
    },
    {
      id: "5",
      subject: "Eid Announcement",
      content:
        "Eid prayer will be held at the community center. First session at 7:30 AM, second session at 9:00 AM.",
      recipients: "All Members",
      date: "2023-04-25",
      status: "scheduled",
    },
    {
      id: "6",
      subject: "Committee Meeting",
      content:
        "Reminder: Monthly committee meeting this Sunday after Asr prayer in the conference room.",
      recipients: "Committee Members",
      date: "2023-04-22",
      status: "draft",
    },
  ];

  // Filter messages based on search query and status filter
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.recipients.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter ? message.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
        <TabsTrigger value="compose">Compose</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>

      <TabsContent value="compose" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>
              Create a new message to send to your community members.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select>
                <SelectTrigger id="recipients">
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="committee">Committee Members</SelectItem>
                  <SelectItem value="volunteers">Volunteers</SelectItem>
                  <SelectItem value="donors">Donors</SelectItem>
                  <SelectItem value="custom">Custom Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter message subject" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                placeholder="Enter your message"
                className="min-h-[200px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="schedule" />
              <Label htmlFor="schedule">Schedule for later</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save as Draft</Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="messages" className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter
                    ? `Status: ${statusFilter}`
                    : "Filter by Status"}
                </Button>
              </DropdownMenuTrigger>
              {/* <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent> */}
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="divide-y">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          {message.starred ? (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <h4 className="font-medium">{message.subject}</h4>
                      </div>
                      <Badge className={getStatusColor(message.status)}>
                        {message.status.charAt(0).toUpperCase() +
                          message.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="ml-6 text-sm text-muted-foreground mb-2 line-clamp-2">
                      {message.content}
                    </div>
                    <div className="ml-6 flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>To: {message.recipients}</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(message.date)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Archive className="h-3 w-3" />
                          <span className="sr-only">Archive</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Trash className="h-3 w-3" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
