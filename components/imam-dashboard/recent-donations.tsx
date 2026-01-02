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
import { useEffect, useMemo, useState } from "react";
import { getDonationCampaigns } from "@/app/(dashboards)/imam/donations/action";
import { auth } from "@/firebase/client";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

interface RecentDonationsProps {
  showAll?: boolean;
}

type Campaign = {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  amountRaised: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming" | "archived";
  category: "general" | "construction" | "education" | "charity" | "emergency";
  createdAt?: any;
  updatedAt?: any;
};

export function RecentDonations({ showAll = false }: RecentDonationsProps) {
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const router = useRouter();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await getDonationCampaigns(token);

      if (response.success && response.campaigns) {
        // Convert Firestore Timestamps to ISO strings
        const sanitizedCampaigns = response.campaigns.map((c: Campaign) => ({
          ...c,
          createdAt: c.createdAt?._seconds
            ? new Date(c.createdAt._seconds * 1000).toISOString()
            : c.createdAt,
          updatedAt: c.updatedAt?._seconds
            ? new Date(c.updatedAt._seconds * 1000).toISOString()
            : c.updatedAt,
        }));
        setCampaigns(sanitizedCampaigns);
      } else {
        throw new Error(response.message || "Failed to fetch campaigns");
        setCampaigns([]);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", (error as Error).message);
      setCampaigns([]); // optional: clear campaigns on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const displayCampaigns = useMemo(
    () => (showAll ? campaigns : campaigns.slice(0, 3)),
    [showAll, campaigns]
  );

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

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (campaigns.length === 0) {
    return <div className="p-4 text-center">No campaigns found.</div>;
  }
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <ScrollArea className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Goal Amount</TableHead>
                <TableHead className="hidden md:table-cell">
                  Start Date
                </TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={campaign.image || "/placeholder.svg"}
                          alt={campaign.title}
                        />
                        <AvatarFallback>
                          {campaign.title.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{campaign.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {campaign.description}
                        </span>
                        <div className="md:hidden text-xs text-muted-foreground">
                          <div>{formatDate(campaign.startDate)}</div>
                          <div>{campaign.category}</div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {campaign.goal_amount}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(campaign.startDate)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {campaign.category}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getRankColor(campaign.status)}`}
                    >
                      {campaign.status}
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
          <Button
            variant="link"
            onClick={() => router.push("/imam/donations")}
            size="sm"
          >
            View All Donations
          </Button>
        </div>
      )}
    </div>
  );
}
