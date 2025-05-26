"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentDonationsProps {
  showAll?: boolean;
}

export function RecentDonations({ showAll = false }: RecentDonationsProps) {
  // Mock data - in a real app, this would come from an API
  const donations = [
    {
      id: "1",
      donor: {
        name: "Ahmed Khan",
        email: "ahmed@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      amount: "$100.00",
      date: "2023-04-21",
      status: "completed",
      type: "General",
      rank: "Muḥsin",
    },
    {
      id: "2",
      donor: {
        name: "Fatima Ali",
        email: "fatima@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      amount: "$250.00",
      date: "2023-04-20",
      status: "completed",
      type: "Friday Khutbah",
      rank: "Ṣādiq",
    },
    {
      id: "3",
      donor: {
        name: "Omar Rahman",
        email: "omar@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      amount: "$50.00",
      date: "2023-04-19",
      status: "completed",
      type: "General",
      rank: "Muḥsin",
    },
    {
      id: "4",
      donor: {
        name: "Aisha Malik",
        email: "aisha@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      amount: "$500.00",
      date: "2023-04-18",
      status: "completed",
      type: "General",
      rank: "Käfil",
    },
    {
      id: "5",
      donor: {
        name: "Yusuf Ibrahim",
        email: "yusuf@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      amount: "$75.00",
      date: "2023-04-17",
      status: "completed",
      type: "Friday Khutbah",
      rank: "Muḥsin",
    },
  ];

  const displayDonations = showAll ? donations : donations.slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Muḥsin":
        return "bg-green-100 text-green-800";
      case "Ṣādiq":
        return "bg-blue-100 text-blue-800";
      case "Käfil":
        return "bg-purple-100 text-purple-800";
      case "Munfiq":
        return "bg-yellow-100 text-yellow-800";
      case "Mujahid":
        return "bg-orange-100 text-orange-800";
      case "Waqif":
        return "bg-red-100 text-red-800";
      case "Ḥami al-Masjid":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <ScrollArea className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={donation.donor.image || "/placeholder.svg"}
                          alt={donation.donor.name}
                        />
                        <AvatarFallback>
                          {donation.donor.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {donation.donor.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {donation.donor.email}
                        </span>
                        <div className="md:hidden text-xs text-muted-foreground">
                          <div>{formatDate(donation.date)}</div>
                          <div>{donation.type}</div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {donation.amount}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(donation.date)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {donation.type}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getRankColor(donation.rank)}`}
                    >
                      {donation.rank}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {!showAll && (
        <div className="flex justify-center">
          <Button variant="link" size="sm">
            View All Donations
          </Button>
        </div>
      )}
    </div>
  );
}
