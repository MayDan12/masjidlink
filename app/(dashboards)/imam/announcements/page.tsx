import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnnouncementsList } from "@/components/imam-dashboard/announcements-list";
import { AnnouncementEditor } from "@/components/imam-dashboard/announcements";
import { EmergencyAlerts } from "@/components/imam-dashboard/emergency-alerts";
import { AlertCircle, Edit, PlusCircle } from "lucide-react";

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">
          Create and manage announcements to keep your community informed about
          important updates.
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-3">
        <TabsList>
          <TabsTrigger value="create" className="gap-1">
            <PlusCircle className="h-5 w-5" />
            Create
          </TabsTrigger>
          <TabsTrigger value="manage" className="gap-1">
            <Edit className="h-5 w-5" />
            View
          </TabsTrigger>
          <TabsTrigger value="emergency" className="gap-1">
            <AlertCircle className="h-5 w-5" /> Emergency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Announcement</CardTitle>
              <CardDescription>
                Compose a new announcement for your masjid community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnouncementEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Announcements</CardTitle>
              <CardDescription>
                View, edit, and delete existing announcements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnouncementsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Alerts</CardTitle>
              <CardDescription>
                Create and manage urgent notifications for your community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyAlerts />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
