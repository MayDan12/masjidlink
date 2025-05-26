"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Save, AlertTriangle, Download, Trash } from "lucide-react";

const accountFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Mock default values
  const defaultValues: AccountFormValues = {
    username: "ahmed_khan",
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  function onSubmit(data: AccountFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your account information and username.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public username that will be visible to other
                      users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Account Email</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    ahmed.khan@example.com
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Change Email
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Account Type</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      Standard User
                    </p>
                    <Badge
                      variant="outline"
                      className="text-blue-500 border-blue-200 bg-blue-50"
                    >
                      Active
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Linked Accounts</CardTitle>
          <CardDescription>
            Manage accounts linked to your MasjidLink profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#4285F4] rounded-full flex items-center justify-center">
                <span className="text-white font-medium">G</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Google</h4>
                <p className="text-xs text-muted-foreground">
                  Connected on May 12, 2023
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Disconnect
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                <span className="text-white font-medium">F</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Facebook</h4>
                <p className="text-xs text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Apple</h4>
                <p className="text-xs text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Data & Account Actions</CardTitle>
          <CardDescription>
            Export your data or delete your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 border rounded-md">
            <Download className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Export Your Data</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Download a copy of your personal data, including your profile
                information, preferences, and activity history.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Request Data Export
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-red-100 rounded-md bg-red-50">
            <Trash className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-600">
                Delete Account
              </h4>
              <p className="text-sm text-red-600/80 mt-1">
                Permanently delete your account and all your data. This action
                cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="mt-2">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t flex flex-col items-start">
          <div className="flex items-start gap-2 mt-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium text-foreground">
                Account Management
              </h4>
              <p className="mt-1">
                Changes to your account settings may take up to 24 hours to
                fully propagate across all systems.
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
