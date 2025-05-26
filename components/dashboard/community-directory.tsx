"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, UserPlus, MessageSquare } from "lucide-react";

type CommunityMember = {
  id: string;
  name: string;
  role: string;
  masjid: string;
  location: string;
  skills: string[];
  isConnected: boolean;
  image?: string;
  joinDate: Date;
};

export function CommunityDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("name");

  // Mock community members data
  const members: CommunityMember[] = [
    {
      id: "1",
      name: "Abdullah Khan",
      role: "Imam",
      masjid: "Masjid Al-Noor",
      location: "Chicago, IL",
      skills: ["Teaching", "Counseling", "Arabic"],
      isConnected: true,
      image: "/placeholder.svg?height=60&width=60",
      joinDate: new Date(2020, 5, 15),
    },
    {
      id: "2",
      name: "Sarah Ahmed",
      role: "Teacher",
      masjid: "Islamic Center",
      location: "Chicago, IL",
      skills: ["Islamic Studies", "Youth Mentoring"],
      isConnected: false,
      image: "/placeholder.svg?height=60&width=60",
      joinDate: new Date(2021, 2, 10),
    },
    {
      id: "3",
      name: "Mohammed Ali",
      role: "Youth Leader",
      masjid: "Masjid Al-Rahman",
      location: "Chicago, IL",
      skills: ["Event Planning", "Sports", "Mentoring"],
      isConnected: true,
      image: "/placeholder.svg?height=60&width=60",
      joinDate: new Date(2019, 8, 22),
    },
    {
      id: "4",
      name: "Fatima Hassan",
      role: "Volunteer Coordinator",
      masjid: "Islamic Center",
      location: "Chicago, IL",
      skills: ["Organization", "Fundraising", "Community Outreach"],
      isConnected: false,
      image: "/placeholder.svg?height=60&width=60",
      joinDate: new Date(2022, 1, 5),
    },
    {
      id: "5",
      name: "Yusuf Ibrahim",
      role: "Board Member",
      masjid: "Masjid Al-Taqwa",
      location: "Chicago, IL",
      skills: ["Administration", "Finance", "Strategic Planning"],
      isConnected: false,
      image: "/placeholder.svg?height=60&width=60",
      joinDate: new Date(2018, 4, 18),
    },
  ];

  // Filter and sort members
  const filteredMembers = members
    .filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.masjid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesRole =
        roleFilter === "all" ||
        member.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "role") {
        return a.role.localeCompare(b.role);
      } else if (sortOrder === "recent") {
        return b.joinDate.getTime() - a.joinDate.getTime();
      }
      return 0;
    });

  const connectWithMember = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Connect with member ${id}`);
  };

  const messageMember = (id: string) => {
    // In a real app, this would open a messaging interface
    console.log(`Message member ${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="imam">Imam</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="youth leader">Youth Leader</SelectItem>
              <SelectItem value="volunteer coordinator">
                Volunteer Coordinator
              </SelectItem>
              <SelectItem value="board member">Board Member</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="recent">Recently Joined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                  />
                  <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{member.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{member.role}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {member.masjid}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {member.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {member.isConnected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => messageMember(member.id)}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Message</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => connectWithMember(member.id)}
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Connect</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Members Found</h3>
          <p className="text-muted-foreground mb-4">
            No community members match your search criteria.
          </p>
          <Button variant="outline">Clear Filters</Button>
        </div>
      )}

      {filteredMembers.length > 0 && (
        <div className="text-center">
          <Button variant="outline">Load More Members</Button>
        </div>
      )}
    </div>
  );
}
