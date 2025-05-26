import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInformation } from "@/components/dashboard/profile-information";
import { ProfilePreferences } from "@/components/dashboard/profile-preferences";
import { ProfileSecurity } from "@/components/dashboard/profile-security";
import { User, Settings, Shield } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information, preferences, and account security.
        </p>
      </div>

      <Tabs defaultValue="information" className="space-y-4">
        <TabsList>
          <TabsTrigger value="information" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Information</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="information" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileInformation />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your app experience and notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilePreferences />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password, two-factor authentication, and security
                preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSecurity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
