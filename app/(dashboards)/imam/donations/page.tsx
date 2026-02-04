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

export default function DonationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Donations</h1>
          <p className="text-muted-foreground">
            Manage donation campaigns, track contributions, and engage with
            donors.
          </p>
        </div>
        <CreateCampaignDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </CreateCampaignDialog>
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

        {/* <TabsContent value="reports" className="space-y-4">
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
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
