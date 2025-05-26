"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Ban, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RecentUserSignups() {
  // Mock data - in a real app, this would come from an API
  const users = [
    {
      id: "1",
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      role: "User",
      joinedDate: "April 21, 2023",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Fatima Ali",
      email: "fatima@example.com",
      role: "User",
      joinedDate: "April 20, 2023",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Omar Rahman",
      email: "omar@example.com",
      role: "Imam",
      joinedDate: "April 19, 2023",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "Aisha Malik",
      email: "aisha@example.com",
      role: "User",
      joinedDate: "April 18, 2023",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      name: "Yusuf Ibrahim",
      email: "yusuf@example.com",
      role: "Imam",
      joinedDate: "April 17, 2023",
      image: "/placeholder.svg?height=32&width=32",
    },
  ];

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user.image || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Joined: {user.joinedDate}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Contact User</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Ban className="mr-2 h-4 w-4" />
                Suspend Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
      <div className="pt-2 text-center">
        <Button variant="link" size="sm">
          View All Users
        </Button>
      </div>
    </div>
  );
}
