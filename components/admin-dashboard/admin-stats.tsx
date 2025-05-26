"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ChurchIcon as Mosque, Flag, Users } from "lucide-react";

export function AdminStats() {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: "Total Users",
      value: "12,345",
      icon: Users,
      change: "+12%",
      description: "from last month",
    },
    {
      title: "Verified Masjids",
      value: "324",
      icon: Mosque,
      change: "+8%",
      description: "from last month",
    },
    {
      title: "Pending Verifications",
      value: "28",
      icon: Flag,
      change: "-5%",
      description: "from last month",
    },
    {
      title: "Content Reports",
      value: "17",
      icon: BarChart,
      change: "+18%",
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
              <span
                className={
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {stat.change}
              </span>{" "}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
