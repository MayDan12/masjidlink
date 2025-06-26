"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react";

export function DonationStats() {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: "Total Donations",
      value: "$0",
      icon: DollarSign,
      change: "+0%",
      description: "from last month",
    },
    {
      title: "Total Donors",
      value: "0",
      icon: Users,
      change: "+0%",
      description: "from last month",
    },
    {
      title: "Average Donation",
      value: "$0",
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
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{stat.change}</span>{" "}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
