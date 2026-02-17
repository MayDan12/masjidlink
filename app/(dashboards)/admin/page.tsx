"use client";
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
// import { RecentUserSignups } from "@/components/admin-dashboard/recent-user-signup";
// import { ReportedContent } from "@/components/admin-dashboard/reported-content";
import { useEffect, useState } from "react";
import { getUsersAndMasjids } from "./action";
import { User } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    users: User[];
    masjids: User[];
  } | null>(null);

  useEffect(() => {
    getUsersAndMasjids().then((res) => {
      if (res.success) {
        setData(res.data);
      }
    });
  }, []);
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
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminStats
              users={data?.users || []}
              masjids={data?.masjids || []}
            />
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
                <MasjidVerificationQueue masjids={data?.masjids || []} />
              </CardContent>
            </Card>

            {/* <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent User Signups</CardTitle>
                <CardDescription>
                  New user registrations on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentUserSignups />
              </CardContent>
            </Card> */}
          </div>

          {/* <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>
                Review and moderate reported content from users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportedContent />
            </CardContent>
          </Card> */}
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
              <MasjidVerificationQueue masjids={data?.masjids || []} />
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
              {/* format in good table form */}
              {data?.users.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div>No users found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
