"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MoreHorizontal, Mail, Filter, UserPlus, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Volunteer = {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  availability: "weekdays" | "weekends" | "evenings" | "flexible"
  status: "active" | "inactive"
  hours: number
  image?: string
}

type VolunteerOpportunity = {
  id: string
  title: string
  description: string
  date: string
  time: string
  volunteers: {
    needed: number
    signed: number
  }
  status: "upcoming" | "ongoing" | "completed"
}

export function VolunteerManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Mock volunteers data
  const volunteers: Volunteer[] = [
    {
      id: "1",
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "(555) 123-4567",
      skills: ["Teaching", "Event Planning"],
      availability: "weekends",
      status: "active",
      hours: 45,
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Fatima Ali",
      email: "fatima@example.com",
      phone: "(555) 234-5678",
      skills: ["Cooking", "Childcare"],
      availability: "flexible",
      status: "active",
      hours: 32,
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Omar Rahman",
      email: "omar@example.com",
      phone: "(555) 345-6789",
      skills: ["Maintenance", "IT Support"],
      availability: "evenings",
      status: "active",
      hours: 28,
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "Aisha Malik",
      email: "aisha@example.com",
      phone: "(555) 456-7890",
      skills: ["Graphic Design", "Social Media"],
      availability: "weekdays",
      status: "inactive",
      hours: 15,
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      name: "Yusuf Ibrahim",
      email: "yusuf@example.com",
      phone: "(555) 567-8901",
      skills: ["Teaching", "Translation"],
      availability: "weekends",
      status: "active",
      hours: 50,
      image: "/placeholder.svg?height=32&width=32",
    },
  ]

  // Mock opportunities data
  const opportunities: VolunteerOpportunity[] = [
    {
      id: "1",
      title: "Friday Cleanup",
      description: "Help clean the masjid after Jumu'ah prayers",
      date: "2023-04-28",
      time: "2:30 PM - 4:00 PM",
      volunteers: {
        needed: 5,
        signed: 3,
      },
      status: "upcoming",
    },
    {
      id: "2",
      title: "Food Pantry Distribution",
      description: "Distribute food packages to those in need",
      date: "2023-04-29",
      time: "10:00 AM - 1:00 PM",
      volunteers: {
        needed: 8,
        signed: 6,
      },
      status: "upcoming",
    },
    {
      id: "3",
      title: "Children's Quran Class",
      description: "Assist with teaching children's Quran class",
      date: "2023-04-30",
      time: "11:00 AM - 12:30 PM",
      volunteers: {
        needed: 4,
        signed: 2,
      },
      status: "upcoming",
    },
    {
      id: "4",
      title: "Eid Decoration Setup",
      description: "Help decorate the masjid for Eid celebration",
      date: "2023-05-05",
      time: "6:00 PM - 9:00 PM",
      volunteers: {
        needed: 10,
        signed: 4,
      },
      status: "upcoming",
    },
  ]

  // Filter volunteers based on search query and status filter
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.phone.includes(searchQuery) ||
      volunteer.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter ? volunteer.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  // Get availability badge color
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "weekdays":
        return "bg-blue-100 text-blue-800"
      case "weekends":
        return "bg-green-100 text-green-800"
      case "evenings":
        return "bg-purple-100 text-purple-800"
      case "flexible":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Tabs defaultValue="volunteers" className="space-y-4">
      <TabsList>
        <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
        <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
      </TabsList>

      <TabsContent value="volunteers" className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search volunteers by name, email, or skills..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter ? `Status: ${statusFilter}` : "Filter by Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Volunteer
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Volunteer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVolunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={volunteer.image || "/placeholder.svg"} alt={volunteer.name} />
                            <AvatarFallback>{volunteer.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{volunteer.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{volunteer.email}</div>
                          <div className="text-muted-foreground">{volunteer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAvailabilityColor(volunteer.availability)}>
                          {volunteer.availability.charAt(0).toUpperCase() + volunteer.availability.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{volunteer.hours} hrs</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(volunteer.status)}>
                          {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Assign to Opportunity</DropdownMenuItem>
                              <DropdownMenuItem>Log Hours</DropdownMenuItem>
                              <DropdownMenuItem>Edit Skills</DropdownMenuItem>
                              {volunteer.status === "active" ? (
                                <DropdownMenuItem>Mark as Inactive</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Mark as Active</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="opportunities" className="space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Volunteer Opportunities</h3>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Create Opportunity
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id}>
              <CardHeader>
                <CardTitle>{opportunity.title}</CardTitle>
                <CardDescription>
                  {formatDate(opportunity.date)} • {opportunity.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{opportunity.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">{opportunity.volunteers.signed}</span> of{" "}
                    <span className="font-medium">{opportunity.volunteers.needed}</span> volunteers signed up
                  </div>
                  <Badge
                    variant={opportunity.volunteers.signed >= opportunity.volunteers.needed ? "default" : "secondary"}
                  >
                    {opportunity.volunteers.signed >= opportunity.volunteers.needed
                      ? "Fully Staffed"
                      : `Need ${opportunity.volunteers.needed - opportunity.volunteers.signed} More`}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">Assign Volunteers</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
