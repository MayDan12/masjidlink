"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MoreHorizontal, Mail, Download, Filter } from "lucide-react"

type Donor = {
  id: string
  name: string
  email: string
  phone: string
  totalDonated: number
  lastDonation: string
  frequency: "one-time" | "monthly" | "weekly" | "quarterly" | "yearly"
  rank: string
  image?: string
}

export function DonorsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [frequencyFilter, setFrequencyFilter] = useState<string | null>(null)

  // Mock donors data
  const donors: Donor[] = [
    {
      id: "1",
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "(555) 123-4567",
      totalDonated: 1250,
      lastDonation: "2023-04-15",
      frequency: "monthly",
      rank: "Muḥsin",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Fatima Ali",
      email: "fatima@example.com",
      phone: "(555) 234-5678",
      totalDonated: 3500,
      lastDonation: "2023-04-10",
      frequency: "monthly",
      rank: "Ṣādiq",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Omar Rahman",
      email: "omar@example.com",
      phone: "(555) 345-6789",
      totalDonated: 750,
      lastDonation: "2023-04-05",
      frequency: "one-time",
      rank: "Muḥsin",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "Aisha Malik",
      email: "aisha@example.com",
      phone: "(555) 456-7890",
      totalDonated: 5000,
      lastDonation: "2023-04-01",
      frequency: "quarterly",
      rank: "Käfil",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      name: "Yusuf Ibrahim",
      email: "yusuf@example.com",
      phone: "(555) 567-8901",
      totalDonated: 2000,
      lastDonation: "2023-03-28",
      frequency: "yearly",
      rank: "Ṣādiq",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "6",
      name: "Zainab Hassan",
      email: "zainab@example.com",
      phone: "(555) 678-9012",
      totalDonated: 10000,
      lastDonation: "2023-03-25",
      frequency: "monthly",
      rank: "Käfil",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "7",
      name: "Anonymous Donor",
      email: "anonymous@example.com",
      phone: "(555) 789-0123",
      totalDonated: 500,
      lastDonation: "2023-03-20",
      frequency: "one-time",
      rank: "Muḥsin",
      image: "/placeholder.svg?height=32&width=32",
    },
  ]

  // Filter donors based on search query and frequency filter
  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.phone.includes(searchQuery)

    const matchesFrequency = frequencyFilter ? donor.frequency === frequencyFilter : true

    return matchesSearch && matchesFrequency
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get rank badge color
  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Muḥsin":
        return "bg-green-100 text-green-800"
      case "Ṣādiq":
        return "bg-blue-100 text-blue-800"
      case "Käfil":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get frequency badge color
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "monthly":
        return "bg-blue-100 text-blue-800"
      case "weekly":
        return "bg-green-100 text-green-800"
      case "quarterly":
        return "bg-purple-100 text-purple-800"
      case "yearly":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search donors..."
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
                {frequencyFilter ? `Frequency: ${frequencyFilter}` : "Filter by Frequency"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFrequencyFilter(null)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFrequencyFilter("one-time")}>One-time</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFrequencyFilter("weekly")}>Weekly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFrequencyFilter("monthly")}>Monthly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFrequencyFilter("quarterly")}>Quarterly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFrequencyFilter("yearly")}>Yearly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Donated</TableHead>
                <TableHead>Last Donation</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={donor.image || "/placeholder.svg"} alt={donor.name} />
                        <AvatarFallback>{donor.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{donor.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{donor.email}</div>
                      <div className="text-muted-foreground">{donor.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(donor.totalDonated)}</TableCell>
                  <TableCell>{formatDate(donor.lastDonation)}</TableCell>
                  <TableCell>
                    <Badge className={getFrequencyColor(donor.frequency)}>
                      {donor.frequency.charAt(0).toUpperCase() + donor.frequency.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRankColor(donor.rank)}>
                      {donor.rank}
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
                          <DropdownMenuItem>View Donation History</DropdownMenuItem>
                          <DropdownMenuItem>Send Thank You</DropdownMenuItem>
                          <DropdownMenuItem>Generate Tax Receipt</DropdownMenuItem>
                          <DropdownMenuItem>Edit Donor Information</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredDonors.length}</span> of{" "}
          <span className="font-medium">{donors.length}</span> donors
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
