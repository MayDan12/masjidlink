import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertsHistory } from "@/components/dashboard/alerts-history";
import { AlertsSettings } from "@/components/dashboard/alerts-settings";
import { AlertsSubscriptions } from "@/components/dashboard/alerts-subscriptions";
import { AlertTriangle, Settings, Bell, ListFilter } from "lucide-react";

export default function EmergencyAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Emergency Alerts
          </h1>
          <p className="text-muted-foreground">
            Receive important emergency notifications from your masjid and
            community.
          </p>
        </div>
        <Button variant="destructive" className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          Report Emergency
        </Button>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Active Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <ListFilter className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="flex items-center gap-1"
          >
            <Bell className="h-4 w-4" />
            <span>Subscriptions</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Emergency Alerts
              </CardTitle>
              <CardDescription className="text-red-700">
                Important alerts from your masjid and community that require
                immediate attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No active emergency alerts at this time.</p>
                <p className="text-sm mt-2">
                  Emergency alerts will appear here when issued by your masjid.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>
                View past emergency alerts from your masjid and community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsHistory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Subscriptions</CardTitle>
              <CardDescription>
                Manage which masjids and communities you receive alerts from.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsSubscriptions />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>
                Configure how you receive emergency alerts and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
