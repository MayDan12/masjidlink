"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Edit,
  Trash,
  Eye,
  Bell,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { auth } from "@/firebase/client";
import { toast } from "sonner";
import {
  deleteAnnouncement,
  getAnnouncementsByUserId,
} from "@/app/(dashboards)/imam/announcements/action";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  expiryDate?: string;
  isEmergency: boolean;
  type: string;
  status: "active" | "scheduled" | "expired";
  severity?: "low" | "medium" | "high" | "critical";
};

export function AnnouncementsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncementsById = async () => {
      try {
        const token = await auth?.currentUser?.getIdToken();
        if (!token) {
          toast.error("Token not found");
          return;
        }

        const response = await getAnnouncementsByUserId({ token });

        if ("error" in response && response.error) {
          toast.error(response.message || "Failed to fetch announcements");
          return;
        }
        console.log(response.announcements);

        setAnnouncements(response.announcements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        toast.error("Something went wrong while fetching announcements.");
      }
    };

    fetchAnnouncementsById(); // ✅ Call the function
  }, []);

  // Filter announcements based on search query and status filter
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter
      ? announcement.type === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });

  // Get announcement type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "prayer":
        return "bg-blue-100 text-blue-800";
      case "janazah":
        return "bg-gray-100 text-gray-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "general":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        toast.error("Token not found");
        return;
      }

      const response = await deleteAnnouncement({ token, announcementId: id });

      if ("error" in response && response.error) {
        toast.error(response.message || "Failed to delete announcement");
        return;
      }

      toast.success("Announcement deleted successfully");
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Something went wrong while deleting the announcement.");
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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search announcements..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {statusFilter ? `Status: ${statusFilter}` : "Filter by Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              {announcements.map((announcements, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={() => setStatusFilter(announcements.type)}
                >
                  {announcements.type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Mobile card view (visible on small screens) */}
      <div className="md:hidden space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-base">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {announcement.content}
                    </p>
                  </div>
                  <Badge className={getTypeColor(announcement.type)}>
                    {announcement.type.charAt(0).toUpperCase() +
                      announcement.type.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2 mt-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    {/* <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>
                      
                    </span> */}
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>{announcement.severity}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  {/* <EventActions event={evenannouncement} /> */}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No events found
          </div>
        )}
      </div>

      <div className="hidden md:block rounded-md border">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Announcement</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map((announcement, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      {announcement.isEmergency && (
                        <Badge variant="destructive" className="mt-0.5">
                          Emergency
                        </Badge>
                      )}
                      <div>
                        <div className="font-medium">{announcement.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {announcement.content}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={getTypeColor(announcement.type)}>
                      {announcement.type.charAt(0).toUpperCase() +
                        announcement.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(announcement.status)}
                    >
                      {announcement.severity ? (
                        announcement.severity.charAt(0).toUpperCase() +
                        announcement.severity.slice(1)
                      ) : (
                        <>
                          <p>Nothing</p>
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Open a dialog to see the full content of the announcement */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View announcement</span>
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Announcement Details</DialogTitle>
                            <DialogDescription>
                              View the full details of this announcement.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Title
                              </p>
                              <p className="font-medium">
                                {announcement.title}
                              </p>
                            </div>

                            <div>
                              <p className="text-muted-foreground text-xs">
                                Content
                              </p>
                              <p>{announcement.content}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  Severity
                                </p>
                                <p className="capitalize">
                                  {announcement.severity}
                                </p>
                              </div>

                              <div>
                                <p className="text-muted-foreground text-xs">
                                  Type
                                </p>
                                <p className="capitalize">
                                  {announcement.type}
                                </p>
                              </div>

                              <div>
                                <p className="text-muted-foreground text-xs">
                                  Status
                                </p>
                                <p className="capitalize">
                                  {announcement.status}
                                </p>
                              </div>

                              <div>
                                <p className="text-muted-foreground text-xs">
                                  Created
                                </p>
                                <p>{formatDate(announcement.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        onClick={() => {
                          handleDelete(announcement.id);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                        <span className="sr-only"> Delete Announcement</span>
                      </Button>

                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Announcement
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Bell className="mr-2 h-4 w-4" />
                            Resend Notification
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Announcement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
