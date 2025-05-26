"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  UserPlus,
  Calendar,
  MessageSquare,
  Lock,
  Globe,
} from "lucide-react";

type Group = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: "education" | "social" | "volunteer" | "sports" | "other";
  privacy: "public" | "private";
  isMember: boolean;
  image?: string;
  lastActive: Date;
  upcomingEvent?: {
    title: string;
    date: Date;
  };
};

export function CommunityGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock groups data
  const groups: Group[] = [
    {
      id: "1",
      name: "Weekend Islamic School",
      description:
        "Group for parents and teachers involved in the weekend Islamic school.",
      members: 45,
      category: "education",
      privacy: "public",
      isMember: true,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: new Date(new Date().setHours(new Date().getHours() - 3)),
      upcomingEvent: {
        title: "Parent-Teacher Meeting",
        date: new Date(new Date().setDate(new Date().getDate() + 5)),
      },
    },
    {
      id: "2",
      name: "Youth Group",
      description:
        "A group for Muslim youth to connect, learn, and grow together.",
      members: 78,
      category: "social",
      privacy: "public",
      isMember: true,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: new Date(new Date().setHours(new Date().getHours() - 1)),
      upcomingEvent: {
        title: "Youth Hiking Trip",
        date: new Date(new Date().setDate(new Date().getDate() + 10)),
      },
    },
    {
      id: "3",
      name: "Community Volunteers",
      description:
        "Organizing volunteer activities to serve our community and beyond.",
      members: 32,
      category: "volunteer",
      privacy: "public",
      isMember: false,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: new Date(new Date().setHours(new Date().getHours() - 12)),
      upcomingEvent: {
        title: "Food Bank Volunteering",
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
      },
    },
    {
      id: "4",
      name: "Quran Study Circle",
      description: "Weekly Quran study and discussion group.",
      members: 25,
      category: "education",
      privacy: "public",
      isMember: false,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
      id: "5",
      name: "Masjid Basketball Team",
      description:
        "Basketball team representing our masjid in local tournaments.",
      members: 15,
      category: "sports",
      privacy: "private",
      isMember: true,
      image: "/placeholder.svg?height=60&width=60",
      lastActive: new Date(new Date().setHours(new Date().getHours() - 36)),
      upcomingEvent: {
        title: "Practice Session",
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
      },
    },
  ];

  // Filter groups based on search query and active tab
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "my-groups" && group.isMember) ||
      activeTab === group.category;

    return matchesSearch && matchesTab;
  });

  const joinGroup = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Join group ${id}`);
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Active now";
    } else if (diffInHours < 24) {
      return `Active ${diffInHours} ${
        diffInHours === 1 ? "hour" : "hours"
      } ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Active ${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="gap-1">
          <UserPlus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <Card key={group.id}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={group.image || "/placeholder.svg"}
                    alt={group.name}
                  />
                  <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-medium truncate">{group.name}</h3>
                        {group.privacy === "private" ? (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {formatLastActive(group.lastActive)}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {group.category}
                    </Badge>
                  </div>
                  <p className="text-sm mt-2 line-clamp-2">
                    {group.description}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground mt-3">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{group.members} members</span>
                  </div>

                  {group.upcomingEvent && (
                    <div className="flex items-center text-sm mt-2 p-2 bg-muted rounded-md">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-primary" />
                      <span className="truncate">
                        {group.upcomingEvent.title} -{" "}
                        {group.upcomingEvent.date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    {group.isMember ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Chat</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          View
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => joinGroup(group.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Group
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Groups Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No groups match your search criteria."
              : activeTab === "my-groups"
              ? "You haven't joined any groups yet."
              : "There are no groups in this category."}
          </p>
          <Button>Create a Group</Button>
        </div>
      )}

      {filteredGroups.length > 0 && (
        <div className="text-center">
          <Button variant="outline">View More Groups</Button>
        </div>
      )}
    </div>
  );
}
