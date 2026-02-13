import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationCampaigns } from "@/components/dashboard/donation-campaigns";
// import { DonationHistory } from "@/components/dashboard/donation-history";
// import { RecurringDonations } from "@/components/dashboard/recurring-donations";
import { Heart } from "lucide-react";
import { DonationSearch } from "@/components/dashboard/donation-search";

export default function DonatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Donate</h1>
          <p className="text-muted-foreground">
            Support your local masjids and contribute to important community
            initiatives.
          </p>
        </div>
        <DonationSearch />
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>Campaigns</span>
          </TabsTrigger>
          {/* <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger> */}
          {/* <TabsTrigger value="recurring" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Recurring</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>
                Browse current donation campaigns from masjids in your
                community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DonationCampaigns />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>
                View your past donations and download tax receipts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DonationHistory />
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Donations</CardTitle>
              <CardDescription>
                Manage your recurring donations and payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecurringDonations />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
