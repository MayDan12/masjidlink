"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MoreHorizontal, Users, UserPlus, MessageSquare, Settings } from "lucide-react"

type Group = {
  id: string
  name: string
  description: string
  members: number
  type: "committee" | "class" | "youth" | "sisters" | "brothers" | "other"
  image?: string
}

export function CommunityGroups() {
  // Mock groups data
  const groups: Group[] = [
    {
      id: "1",
      name: "Masjid Committee",
      description: "Main administrative committee for the masjid",
      members: 8,
      type: "committee",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Youth Group",
      description: "Activities and programs for youth ages 13-25",
      members: 35,
      type: "youth",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "Sisters' Circle",
      description: "Women's group for education and community support",
      members: 42,
      type: "sisters",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "4",
      name: "Quran Study",
      description: "Weekly Quran study and tafsir sessions",
      members: 28,
      type: "class",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "5",
      name: "Facilities Committee",
      description: "Responsible for masjid maintenance and improvements",
      members: 6,
      type: "committee",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "6",
      name: "Brothers' Sports",
      description: "Sports activities and events for brothers",
      members: 24,
      type: "brothers",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  // Get group type badge color
  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-blue-100 text-blue-800"
      case "class":
        return "bg-purple-100 text-purple-800"
      case "youth":
        return "bg-green-100 text-green-800"
      case "sisters":
        return "bg-pink-100 text-pink-800"
      case "brothers":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className={getGroupTypeColor(group.type)}>
                    {group.type.charAt(0).toUpperCase() + group.type.slice(1)}
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
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Group
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message Group
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Members
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{group.members} members</span>
                </div>
                <div className="mt-4">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(5, group.members))].map((_, i) => (
                      <Avatar key={i} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i + 1}`} />
                        <AvatarFallback>M{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group.members > 5 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{group.members - 5}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Group
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Add New Group Card */}
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-6 h-[200px]">
              <Button variant="outline" size="lg" className="h-12 w-12 rounded-full mb-4">
                <Plus className="h-6 w-6" />
              </Button>
              <h3 className="font-medium mb-1">Create New Group</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add a new group or committee for your community
              </p>
              <Button>Create Group</Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
