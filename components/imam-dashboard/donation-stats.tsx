"use client";
import { getDonationStats } from "@/app/(dashboards)/imam/donations/action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/firebase/client";
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export function DonationStats() {
  const [stats, setStats] = useState<{
    totalDonations: number;
    activeCampaigns: number;
    completedCampaigns: number;
  }>({
    totalDonations: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
  });

  const fetchStats = async () => {
    const imamId = auth.currentUser?.uid;
    if (!imamId) {
      throw new Error("Imam ID not found");
    }
    return await getDonationStats(imamId);
  };

  useEffect(() => {
    fetchStats().then((data) => setStats(data));
  }, []);

  // Mock data - in a real app, this would come from an API
  const stat = [
    {
      title: "Total Donations",
      value: `$${stats.totalDonations}`,
      icon: DollarSign,
      change: "+0%",
      description: "from last month",
    },
    {
      title: "Total Donors",
      value: `${stats.activeCampaigns}`,
      icon: Users,
      change: "+0%",
      description: "from last month",
    },
    {
      title: "Average Donation",
      value: `$${stats.totalDonations / stats.activeCampaigns}`,
      icon: TrendingUp,
      change: "+0%",
      description: "from last month",
    },
    {
      title: "This Month",
      value: "$0",
      icon: Calendar,
      change: "+0%",
      description: "from last month",
    },
  ];

  return (
    <>
      {stat.map((sta, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{sta.title}</CardTitle>
            <sta.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sta.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{sta.change}</span>{" "}
              {sta.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
