"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash, Eye, BarChart } from "lucide-react"

type Campaign = {
  id: string
  title: string
  description: string
  goal: number
  raised: number
  startDate: string
  endDate: string
  status: "active" | "completed" | "upcoming" | "archived"
  category: "general" | "construction" | "education" | "charity" | "emergency"
}

export function DonationCampaigns() {
  const [activeTab, setActiveTab] = useState("active")

  // Mock campaigns data
  const campaigns: Campaign[] = [
    {
      id: "1",
      title: "Masjid Expansion Project",
      description: "Help us expand our prayer hall to accommodate our growing community.",
      goal: 250000,
      raised: 175000,
      startDate: "2023-01-15",
      endDate: "2023-12-31",
      status: "active",
      category: "construction",
    },
    {
      id: "2",
      title: "Ramadan Food Drive",
      description: "Provide iftar meals for families in need during the holy month of Ramadan.",
      goal: 15000,
      raised: 12500,
      startDate: "2023-03-01",
      endDate: "2023-04-30",
      status: "active",
      category: "charity",
    },
    {
      id: "3",
      title: "Islamic School Scholarships",
      description: "Support education by providing scholarships for students at our Islamic school.",
      goal: 50000,
      raised: 35000,
      startDate: "2023-02-01",
      endDate: "2023-08-31",
      status: "active",
      category: "education",
    },
    {
      id: "4",
      title: "Winter Heating Assistance",
      description: "Help provide heating assistance to families in need during the winter months.",
      goal: 10000,
      raised: 10000,
      startDate: "2022-11-01",
      endDate: "2023-02-28",
      status: "completed",
      category: "charity",
    },
    {
      id: "5",
      title: "Eid Festival",
      description: "Support our upcoming Eid festival celebration for the community.",
      goal: 5000,
      raised: 0,
      startDate: "2023-06-01",
      endDate: "2023-06-30",
      status: "upcoming",
      category: "general",
    },
  ]

  // Filter campaigns based on active tab
  const filteredCampaigns = campaigns.filter((campaign) => campaign.status === activeTab)

  // Calculate progress percentage
  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "construction":
        return "bg-orange-100 text-orange-800"
      case "education":
        return "bg-blue-100 text-blue-800"
      case "charity":
        return "bg-green-100 text-green-800"
      case "emergency":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredCampaigns.length > 0 ? (
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
                          {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
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
                              Edit Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <BarChart className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Campaign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Raised: <span className="font-medium">{formatCurrency(campaign.raised)}</span>
                        </span>
                        <span>
                          Goal: <span className="font-medium">{formatCurrency(campaign.goal)}</span>
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(campaign.raised, campaign.goal)} className="h-2" />
                      <div className="text-xs text-right text-muted-foreground">
                        {getProgressPercentage(campaign.raised, campaign.goal)}% Complete
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Donors
                    </Button>
                    <Button size="sm">Manage Campaign</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
              <h3 className="text-lg font-medium mb-2">No {activeTab} campaigns</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "active"
                  ? "You don't have any active campaigns at the moment."
                  : activeTab === "upcoming"
                    ? "You don't have any upcoming campaigns scheduled."
                    : activeTab === "completed"
                      ? "You don't have any completed campaigns yet."
                      : "You don't have any archived campaigns."}
              </p>
              <Button>Create a New Campaign</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
