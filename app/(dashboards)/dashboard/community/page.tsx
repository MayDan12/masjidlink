import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityFeed } from "@/components/dashboard/community-feed";
import { CommunityGroups } from "@/components/dashboard/community-groups";
import { CommunityEvents } from "@/components/dashboard/community-events";
import { CommunityDirectory } from "@/components/dashboard/community-directory";
import { MessageSquare, Users, Calendar, BookOpen } from "lucide-react";
import { CommunitySearch } from "@/components/dashboard/community-search";

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Connect with your local Muslim community, join groups, and
            participate in discussions.
          </p>
        </div>
        <CommunitySearch />
      </div>

      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Feed</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Groups</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Events</span>
          </TabsTrigger>
          <TabsTrigger value="directory" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Directory</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Feed</CardTitle>
              <CardDescription>
                Stay updated with announcements and discussions from your
                community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityFeed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Groups</CardTitle>
              <CardDescription>
                Join and participate in community groups and committees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityGroups />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Events</CardTitle>
              <CardDescription>
                Discover and join upcoming community events and activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityEvents />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="directory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Directory</CardTitle>
              <CardDescription>
                Browse and connect with members of your community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityDirectory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
