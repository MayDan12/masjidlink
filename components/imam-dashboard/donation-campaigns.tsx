"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  MoreHorizontal,
  Trash,
  Eye,
  BarChart,
  PlusCircle,
  Loader,
} from "lucide-react";
import { CreateCampaignDialog } from "./create-campaign-dialog";
import { EditCampaignDialog } from "./edit-campaign-dialog";
import {
  deleteDonationCampaign,
  getDonationCampaigns,
} from "@/app/(dashboards)/imam/donations/action";
import { auth } from "@/firebase/client";
import { Skeleton } from "../ui/skeleton";

type Campaign = {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  amountRaised: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming" | "archived";
  category: "general" | "construction" | "education" | "charity" | "emergency";
  createdAt?: { _seconds: number } | string;
  updatedAt?: { _seconds: number } | string;
};

type CampaignUI = Omit<Campaign, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};
export function DonationCampaigns({ stripeStatus }: { stripeStatus: string }) {
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignUI[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignUI | null>(
    null,
  );
  const [viewOpen, setViewOpen] = useState(false);
  const [viewCampaign, setViewCampaign] = useState<CampaignUI | null>(null);

  // Fetch campaigns from the server
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await getDonationCampaigns(token);

      if (response.success && response.campaigns) {
        const sanitizedCampaigns: CampaignUI[] = response.campaigns.map(
          (c: Campaign) => {
            const created =
              typeof c.createdAt === "object" &&
              c.createdAt &&
              "_seconds" in c.createdAt
                ? new Date(c.createdAt._seconds * 1000).toISOString()
                : (c.createdAt as string | undefined);
            const updated =
              typeof c.updatedAt === "object" &&
              c.updatedAt &&
              "_seconds" in c.updatedAt
                ? new Date(c.updatedAt._seconds * 1000).toISOString()
                : (c.updatedAt as string | undefined);
            return {
              id: c.id,
              title: c.title,
              description: c.description,
              goal_amount: c.goal_amount,
              amountRaised: c.amountRaised,
              startDate: c.startDate,
              endDate: c.endDate,
              status: c.status,
              category: c.category,
              createdAt: created,
              updatedAt: updated,
            };
          },
        );
        setCampaigns(sanitizedCampaigns);
      } else {
        throw new Error(response.message || "Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", (error as Error).message);
      setCampaigns([]); // optional: clear campaigns on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle campaign deletion
  const handleDelete = async (id: string) => {
    // Implement deletion logic here
    try {
      setLoading(true);
      // Call server action to delete campaign
      await deleteDonationCampaign(id);

      // Refresh campaigns list
      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    } finally {
      setLoading(false);
    }
  };
  // Filter campaigns based on active tab
  const filteredCampaigns = campaigns.filter(
    (campaign) => campaign.status === activeTab,
  );

  // Calculate progress percentage
  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "construction":
        return "bg-orange-100 text-orange-800";
      case "education":
        return "bg-blue-100 text-blue-800";
      case "charity":
        return "bg-green-100 text-green-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{campaign.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(campaign.category)}>
                          {campaign.category.charAt(0).toUpperCase() +
                            campaign.category.slice(1)}
                        </Badge>
                        <DropdownMenu>
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
                            <DropdownMenuItem
                              className="flex items-center"
                              onClick={() => {
                                setViewCampaign(campaign);
                                setViewOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setEditOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <BarChart className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(campaign.id)}
                              className="flex items-center text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Campaign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {campaign.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Raised:{" "}
                          <span className="font-medium">
                            {formatCurrency(campaign.amountRaised)}
                          </span>
                        </span>
                        <span>
                          Goal:{" "}
                          <span className="font-medium">
                            {formatCurrency(campaign.goal_amount)}
                          </span>
                        </span>
                      </div>
                      <Progress
                        value={getProgressPercentage(
                          campaign.amountRaised,
                          campaign.goal_amount,
                        )}
                        className="h-2"
                      />
                      <div className="text-xs text-right text-muted-foreground">
                        {getProgressPercentage(
                          campaign.amountRaised,
                          campaign.goal_amount,
                        )}
                        % Complete
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {/* <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Donors
                    </Button> */}
                    <Button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setEditOpen(true);
                      }}
                      size="sm"
                    >
                      Manage Campaign
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
              <h3 className="text-lg font-medium mb-2">
                No {activeTab} campaigns
              </h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "active"
                  ? "You don't have any active campaigns at the moment."
                  : activeTab === "upcoming"
                    ? "You don't have any upcoming campaigns scheduled."
                    : activeTab === "completed"
                      ? "You don't have any completed campaigns yet."
                      : "You don't have any archived campaigns."}
              </p>
              {stripeStatus === "connected" && (
                <CreateCampaignDialog>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                </CreateCampaignDialog>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {viewCampaign && (
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewCampaign.title}</DialogTitle>
              <DialogDescription>
                Detailed information about this donation campaign.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(viewCampaign.category)}>
                  {viewCampaign.category.charAt(0).toUpperCase() +
                    viewCampaign.category.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {viewCampaign.status.charAt(0).toUpperCase() +
                    viewCampaign.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(viewCampaign.startDate).toLocaleDateString()} -{" "}
                {new Date(viewCampaign.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm">{viewCampaign.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Raised:{" "}
                    <span className="font-medium">
                      {formatCurrency(viewCampaign.amountRaised)}
                    </span>
                  </span>
                  <span>
                    Goal:{" "}
                    <span className="font-medium">
                      {formatCurrency(viewCampaign.goal_amount)}
                    </span>
                  </span>
                </div>
                <Progress
                  value={getProgressPercentage(
                    viewCampaign.amountRaised,
                    viewCampaign.goal_amount,
                  )}
                  className="h-2"
                />
                <div className="text-xs text-right text-muted-foreground">
                  {getProgressPercentage(
                    viewCampaign.amountRaised,
                    viewCampaign.goal_amount,
                  )}
                  % Complete
                </div>
              </div>
              {viewCampaign.createdAt && (
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(viewCampaign.createdAt).toLocaleString()}
                </p>
              )}
              {viewCampaign.updatedAt && (
                <p className="text-xs text-muted-foreground">
                  Updated: {new Date(viewCampaign.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {selectedCampaign && (
        <EditCampaignDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          campaign={selectedCampaign}
          onSuccess={async () => {
            await fetchCampaigns();
            setEditOpen(false);
          }}
        >
          <span />
        </EditCampaignDialog>
      )}
    </div>
  );
}
