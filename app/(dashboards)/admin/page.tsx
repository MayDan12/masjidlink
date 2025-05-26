import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/admin-dashboard/dashboard-header";
import { AdminStats } from "@/components/admin-dashboard/admin-stats";
import { MasjidVerificationQueue } from "@/components/admin-dashboard/masjid-verification-queue";
import { RecentUserSignups } from "@/components/admin-dashboard/recent-user-signup";
import { ReportedContent } from "@/components/admin-dashboard/reported-content";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Admin Dashboard"
        text="Manage masjid verifications, users, and platform settings."
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="masjids">Masjids</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminStats />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Masjid Verification Queue</CardTitle>
                <CardDescription>
                  Verify and approve masjid profile requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MasjidVerificationQueue />
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent User Signups</CardTitle>
                <CardDescription>
                  New user registrations on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentUserSignups />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>
                Review and moderate reported content from users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportedContent />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="masjids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Masjid Management</CardTitle>
              <CardDescription>
                Manage all masjids registered on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete masjid management interface will be shown here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage all users registered on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete user management interface will be shown here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Reports</CardTitle>
              <CardDescription>
                Review and moderate all reported content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete content moderation interface will be shown here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
