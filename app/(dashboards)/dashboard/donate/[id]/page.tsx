"use client";
import { getDonationById } from "@/app/(dashboards)/imam/donations/action";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Tag,
  Share2,
  Heart,
} from "lucide-react";
import { Progress } from "@/components/ui/progress"; // Assuming you have shadcn/ui
import { Badge } from "@/components/ui/badge"; // Assuming you have shadcn/ui
import { Button } from "@/components/ui/button"; // Assuming you have shadcn/ui
import { Card, CardContent } from "@/components/ui/card"; // Assuming you have shadcn/ui
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have shadcn/ui
import { useCampaignDonation } from "@/hooks/useCampaignDonation";
import { Input } from "@/components/ui/input";

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
  createdAt?: string;
  updatedAt?: string;
};

const categoryColors = {
  general: "bg-blue-100 text-blue-800",
  construction: "bg-amber-100 text-amber-800",
  education: "bg-emerald-100 text-emerald-800",
  charity: "bg-rose-100 text-rose-800",
  emergency: "bg-red-100 text-red-800",
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  upcoming: "bg-yellow-100 text-yellow-800",
  archived: "bg-gray-100 text-gray-800",
};

const statusIcons = {
  active: <TrendingUp className="w-5 h-5" />,
  completed: <CheckCircle className="w-5 h-5" />,
  upcoming: <Clock className="w-5 h-5" />,
  archived: <AlertCircle className="w-5 h-5" />,
};

export default function CampaignDetailsDonations({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const { createDonationCheckoutSession, loading: donationLoading } =
    useCampaignDonation();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setLoading(true);
        const res = await getDonationById(id);
        if (!res.success) {
          throw new Error(res.message || "Failed to fetch campaign details");
        }
        setCampaign(res.campaign);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateProgress = () => {
    if (!campaign) return 0;
    return (campaign.amountRaised / campaign.goal_amount) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <Skeleton className="h-24 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Campaign Not Found
          </h2>
          <p className="text-gray-500">
            The campaign you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    className={`${categoryColors[campaign.category]} flex items-center gap-1`}
                  >
                    <Tag className="w-3 h-3" />
                    {campaign.category.charAt(0).toUpperCase() +
                      campaign.category.slice(1)}
                  </Badge>
                  <Badge
                    className={`${statusColors[campaign.status]} flex items-center gap-1`}
                  >
                    {statusIcons[campaign.status]}
                    {campaign.status.charAt(0).toUpperCase() +
                      campaign.status.slice(1)}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold mb-3">{campaign.title}</h1>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="gap-2">
                  <Heart className="w-5 h-5" />
                  Save
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>
            </div>

            <p className="text-lg leading-relaxed">{campaign.description}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-blue-700">
                    {formatCurrency(campaign.amountRaised)}
                  </span>
                </div>
                <p className="text-sm text-blue-600">Amount Raised</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-bold text-emerald-700">
                    {formatCurrency(campaign.goal_amount)}
                  </span>
                </div>
                <p className="text-sm text-emerald-600">Goal Amount</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-2xl font-bold text-amber-700">
                    {calculateProgress().toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-amber-600">Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Campaign Progress</span>
                  <span className="text-sm font-bold ">
                    {formatCurrency(campaign.amountRaised)} of{" "}
                    {formatCurrency(campaign.goal_amount)}
                  </span>
                </div>
                <Progress value={calculateProgress()} className="h-3" />
              </div>
              <div className="flex justify-between text-sm">
                <span>0%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Campaign Details</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarDays className="w-5 h-5" />
                          <span className="font-medium">Start Date</span>
                        </div>
                        <p className="text-lg font-semibold ">
                          {formatDate(campaign.startDate)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarDays className="w-5 h-5" />
                          <span className="font-medium">End Date</span>
                        </div>
                        <p className="text-lg font-semibold ">
                          {formatDate(campaign.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold  mb-3">Full Description</h4>
                      <p className=" leading-relaxed whitespace-pre-line">
                        {campaign.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Action Card */}
            <div>
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">
                    Support This Campaign
                  </h3>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Remaining Amount</span>
                      <span className="text-lg font-bold ">
                        {formatCurrency(
                          campaign.goal_amount - campaign.amountRaised,
                        )}
                      </span>
                    </div>
                    <Progress value={calculateProgress()} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60"
                      disabled={donationLoading || selectedAmount <= 0}
                      onClick={async () => {
                        const result = await createDonationCheckoutSession(
                          id,
                          selectedAmount,
                        );

                        // console.log(result);

                        // open in new tab
                        if (result?.url) {
                          window.open(result.url as string, "_blank");
                        }
                      }}
                    >
                      <DollarSign className="w-5 h-5 mr-2" />
                      {donationLoading ? "Processing..." : "Donate Now"}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={selectedAmount === 25 ? "default" : "outline"}
                        size="lg"
                        className="w-full"
                        onClick={() => setSelectedAmount(25)}
                        disabled={donationLoading}
                      >
                        $25
                      </Button>
                      <Button
                        variant={selectedAmount === 50 ? "default" : "outline"}
                        size="lg"
                        className="w-full"
                        onClick={() => setSelectedAmount(50)}
                        disabled={donationLoading}
                      >
                        $50
                      </Button>
                      <Button
                        variant={selectedAmount === 100 ? "default" : "outline"}
                        size="lg"
                        className="w-full"
                        onClick={() => setSelectedAmount(100)}
                        disabled={donationLoading}
                      >
                        $100
                      </Button>
                      <Button
                        variant={selectedAmount === 250 ? "default" : "outline"}
                        size="lg"
                        className="w-full"
                        onClick={() => setSelectedAmount(250)}
                        disabled={donationLoading}
                      >
                        $250
                      </Button>
                    </div>

                    {/* A text input to put desires amount */}
                    <div className="flex items-center justify-center">
                      <Input
                        type="number"
                        placeholder="Enter custom amount"
                        className="w-full"
                        onChange={(e) =>
                          setSelectedAmount(Number(e.target.value))
                        }
                      />
                    </div>

                    <Button variant="ghost" size="lg" className="w-full gap-2">
                      <Heart className="w-5 h-5" />
                      Follow Campaign
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm ">
                      <span className="font-semibold">Note:</span> All donations
                      are tax-deductible and will be used exclusively for this
                      campaign.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
