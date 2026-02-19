"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DonationStats } from "@/components/imam-dashboard/donation-stats";
import { DonationCampaigns } from "@/components/imam-dashboard/donation-campaigns";
import { DonorsList } from "@/components/imam-dashboard/donors-list";
// import { DonationReports } from "@/components/imam-dashboard/donation-reports";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateCampaignDialog } from "@/components/imam-dashboard/create-campaign-dialog";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/client";
import { getMasjidById } from "../../dashboard/masjids/action";
import { toast } from "sonner";

export default function DonationsPage() {
  const [isStripeAccountIdSet, setIsStripeAccountIdSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const checkMasjidStripeAccountId = async () => {
      const uid = auth?.currentUser?.uid;
      if (!uid) {
        throw new Error("User not authenticated");
      }
      const masjidData = await getMasjidById(uid);
      if (!masjidData) {
        throw new Error("Masjid not found for the given Imam.");
      }
      if (!masjidData.data?.stripeAccountId) {
        setIsStripeAccountIdSet(false);
        return;
      }
      setIsStripeAccountIdSet(true);
    };
    checkMasjidStripeAccountId();
  }, []);

  const handleConnectStripe = async () => {
    setIsLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      const res = await fetch("/api/stripe/account-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // it's returning accountId and onboardingUrl
      // we need to redirect the user to the onboardingUrl opened in a new tab
      console.log(data);
      if (data.onboardingUrl) {
        window.open(data.onboardingUrl, "_blank");
      }
    } catch (error) {
      console.error("Error connecting Stripe account:", error);
      // TODO: show an error message to the user
      toast.error(
        `Error connecting Stripe account. Please try again. ${error.message}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Donations</h1>
          <p className="text-muted-foreground">
            Manage donation campaigns, track contributions, and engage with
            donors.
          </p>
          {/* note that the create campaign dialog will only work if the masjid has a stripe account ID */}
          <p className="text-sm text-muted-foreground">
            Note: You can create a campaign only if your masjid has a stripe
            account ID.
          </p>
        </div>

        {isStripeAccountIdSet ? (
          <CreateCampaignDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </CreateCampaignDialog>
        ) : (
          <Button onClick={handleConnectStripe} disabled={isLoading}>
            Connect Stripe Account
          </Button>
        )}

        {/* <CreateCampaignDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </CreateCampaignDialog> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DonationStats />
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          {/* <TabsTrigger value="donors">Donors</TabsTrigger> */}
          {/* <TabsTrigger value="reports">Reports</TabsTrigger> */}
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation Campaigns</CardTitle>
              <CardDescription>
                Manage your ongoing and past donation campaigns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DonationCampaigns />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donors</CardTitle>
              <CardDescription>
                View and manage your masjid&apos;s donors and their
                contributions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DonorsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

{
  /* <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Generate and view financial reports for your masjid.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DonationReports />
            </CardContent>
          </Card>
        </TabsContent> */
}
