"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Calendar,
  Users,
  ChurchIcon as Mosque,
  GraduationCap,
  Utensils,
  Home,
} from "lucide-react";

type Campaign = {
  id: string;
  title: string;
  masjid: string;
  description: string;
  goal: number;
  raised: number;
  daysLeft: number;
  donors: number;
  category: "construction" | "education" | "charity" | "ramadan" | "other";
  featured: boolean;
};

export function DonationCampaigns() {
  const [activeTab, setActiveTab] = useState("all");

  // Mock campaigns data
  const campaigns: Campaign[] = [
    {
      id: "1",
      title: "Masjid Expansion Project",
      masjid: "Masjid Al-Noor",
      description:
        "Help us expand our masjid to accommodate our growing community.",
      goal: 250000,
      raised: 175000,
      daysLeft: 45,
      donors: 320,
      category: "construction",
      featured: true,
    },
    {
      id: "2",
      title: "Weekend Islamic School",
      masjid: "Islamic Center",
      description:
        "Support our weekend school program for children in the community.",
      goal: 50000,
      raised: 32500,
      daysLeft: 60,
      donors: 145,
      category: "education",
      featured: false,
    },
    {
      id: "3",
      title: "Ramadan Food Drive",
      masjid: "Masjid Al-Rahman",
      description: "Help provide iftar meals for those in need during Ramadan.",
      goal: 15000,
      raised: 9800,
      daysLeft: 15,
      donors: 210,
      category: "ramadan",
      featured: true,
    },
    {
      id: "4",
      title: "Community Support Fund",
      masjid: "Islamic Center",
      description:
        "Emergency assistance for families facing financial hardship.",
      goal: 30000,
      raised: 12500,
      daysLeft: 90,
      donors: 85,
      category: "charity",
      featured: false,
    },
    {
      id: "5",
      title: "New Carpet for Prayer Hall",
      masjid: "Masjid Al-Taqwa",
      description: "Help us replace the worn carpets in our main prayer hall.",
      goal: 8000,
      raised: 3200,
      daysLeft: 30,
      donors: 45,
      category: "construction",
      featured: false,
    },
  ];

  // Filter campaigns based on active tab
  const filteredCampaigns =
    activeTab === "all"
      ? campaigns
      : activeTab === "featured"
      ? campaigns.filter((campaign) => campaign.featured)
      : campaigns.filter((campaign) => campaign.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "construction":
        return <Mosque className="h-4 w-4" />;
      case "education":
        return <GraduationCap className="h-4 w-4" />;
      case "charity":
        return <Heart className="h-4 w-4" />;
      case "ramadan":
        return <Utensils className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="construction">Construction</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="charity">Charity</TabsTrigger>
          <TabsTrigger value="ramadan">Ramadan</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className={campaign.featured ? "border-primary/50" : ""}
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
                {campaign.masjid}
              </p>
              <p className="text-sm mt-2 line-clamp-2">
                {campaign.description}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    ${campaign.raised.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    ${campaign.goal.toLocaleString()} goal
                  </span>
                </div>
                <Progress
                  value={(campaign.raised / campaign.goal) * 100}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {campaign.donors} donors
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {campaign.daysLeft} days left
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="w-full">Donate Now</Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Save Campaign</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Campaigns Found</h3>
          <p className="text-muted-foreground mb-4">
            There are no active campaigns in this category at the moment.
          </p>
        </div>
      )}

      {filteredCampaigns.length > 0 && (
        <div className="text-center">
          <Button variant="outline">View More Campaigns</Button>
        </div>
      )}
    </div>
  );
}
