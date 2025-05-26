import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CommunityMembers } from "@/components/imam-dashboard/community-members"
import { CommunityGroups } from "@/components/imam-dashboard/community-groups"
import { VolunteerManagement } from "@/components/imam-dashboard/volunteer-management"
import { MessageCenter } from "@/components/imam-dashboard/message-center"
import { PlusCircle, Send } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Manage your masjid community, organize groups, and coordinate volunteers.
          </p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
              <CardDescription>View and manage members of your masjid community.</CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityMembers />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Community Groups</CardTitle>
                <CardDescription>Organize your community into groups and committees.</CardDescription>
              </div>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Group
              </Button>
            </CardHeader>
            <CardContent>
              <CommunityGroups />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Management</CardTitle>
              <CardDescription>Coordinate volunteers for masjid activities and events.</CardDescription>
            </CardHeader>
            <CardContent>
              <VolunteerManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Center</CardTitle>
              <CardDescription>Send messages and communicate with your community.</CardDescription>
            </CardHeader>
            <CardContent>
              <MessageCenter />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
