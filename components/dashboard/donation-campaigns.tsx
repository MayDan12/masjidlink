"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, GraduationCap, Utensils, Home } from "lucide-react";
import { auth } from "@/firebase/client";
import { getDonationsCampaigns } from "@/app/(dashboards)/imam/donations/action";
import { MosqueIcon } from "../icons/MosqueIcon";
import { useRouter } from "next/navigation";
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
  createdAt?: any;
  updatedAt?: any;
};

export function DonationCampaigns() {
  const [activeTab, setActiveTab] = useState("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await getDonationsCampaigns();

      if (response.success && response.campaigns) {
        // Convert Firestore Timestamps to ISO strings
        const sanitizedCampaigns = response.campaigns.map((c: Campaign) => ({
          ...c,
          createdAt: c.createdAt?._seconds
            ? new Date(c.createdAt._seconds * 1000).toISOString()
            : c.createdAt,
          updatedAt: c.updatedAt?._seconds
            ? new Date(c.updatedAt._seconds * 1000).toISOString()
            : c.updatedAt,
        }));
        setCampaigns(sanitizedCampaigns);
      } else {
        throw new Error(response.message || "Failed to fetch campaigns");
        setCampaigns([]);
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

  // Filter campaigns based on active tab
  const filteredCampaigns =
    activeTab === "all"
      ? campaigns
      : activeTab === "featured"
        ? campaigns.filter((campaign) => campaign.status === "active")
        : campaigns.filter((campaign) => campaign.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "construction":
        return <MosqueIcon className="h-4 w-4" />;
      case "education":
        return <GraduationCap className="h-4 w-4" />;
      case "charity":
        return <Heart className="h-4 w-4" />;
      case "emergency":
        return <Utensils className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  if (!loading && filteredCampaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Campaigns Found</h3>
        <p className="text-muted-foreground mb-4">
          There are no active campaigns in this category at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="construction">Construction</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="charity">Charity</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-primary/50">
              <CardContent className="p-4">
                <Skeleton className="animate-pulse flex items-center justify-center h-48 bg-muted"></Skeleton>
                <Skeleton className="flex justify-between items-center mt-4">
                  <Skeleton className="h-4 w-24 bg-muted"></Skeleton>
                  <Skeleton className="h-4 w-12 bg-muted"></Skeleton>
                </Skeleton>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className={
                campaign.status === "active" ? "border-primary/50" : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{campaign.title}</h3>
                  <Badge className="flex items-center gap-1">
                    {getCategoryIcon(campaign.category)}
                    <span className="capitalize">{campaign.category}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {campaign.status === "active" ? "Active" : "Completed"}
                </p>
                <p className="text-sm mt-2 line-clamp-2">
                  {campaign.description}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      ${campaign.amountRaised.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      ${campaign.goal_amount.toLocaleString()} goal
                    </span>
                  </div>
                  <Progress
                    value={(campaign.amountRaised / campaign.goal_amount) * 100}
                    className="h-2"
                  />
                  {/* <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {campaign.donors} donors
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {campaign.daysLeft} days left
                  </span>
                </div> */}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() =>
                      router.push(`/dashboard/donate/${campaign.id}`)
                    }
                    className="w-full"
                  >
                    View Donation
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Save Campaign</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Campaigns Found</h3>
          <p className="text-muted-foreground mb-4">
            There are no active campaigns in this category at the moment.
          </p>
        </div>
      )} */}

      {filteredCampaigns.length > 0 && (
        <div className="text-center">
          <Button variant="outline">View More Campaigns</Button>
        </div>
      )}
    </div>
  );
}
