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
import { Switch } from "@/components/ui/switch";
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
import { Loader2, Save, Shield, AlertTriangle } from "lucide-react";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const securityFormSchema = z.object({
  twoFactorEnabled: z.boolean(),
  // loginNotifications: z.boolean(),
  // sessionsManagement: z.boolean(),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;

export function ProfileSecurity() {
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);

  // Mock security settings
  const defaultSecurityValues: SecurityFormValues = {
    twoFactorEnabled: false,
    // loginNotifications: true,
    // sessionsManagement: false,
  };

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: defaultSecurityValues,
  });

  function onPasswordSubmit(data: PasswordFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
      passwordForm.reset();
    }, 1500);
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
      if (data.twoFactorEnabled && !defaultSecurityValues.twoFactorEnabled) {
        setShowTwoFactorSetup(true);
      }
    }, 1500);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters and include
                      uppercase, lowercase, and numbers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Password
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
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account&apos;s security preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...securityForm}>
            <form
              onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
              className="space-y-4"
            >
              <FormField
                control={securityForm.control}
                name="twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-base">
                          Two-Factor Authentication
                        </FormLabel>
                        <Badge
                          variant="outline"
                          className="text-orange-500 border-orange-200 bg-orange-50"
                        >
                          Recommended
                        </Badge>
                      </div>
                      <FormDescription>
                        Add an extra layer of security to your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {showTwoFactorSetup && (
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      Two-Factor Authentication Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      To complete the setup, please scan the QR code with your
                      authentication app or enter the code manually.
                    </p>
                    <div className="flex justify-center my-4">
                      <div className="border w-40 h-40 flex items-center justify-center bg-white">
                        <span className="text-xs text-muted-foreground">
                          QR Code Placeholder
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-center mb-2">
                      Or enter this code manually:
                    </p>
                    <p className="text-sm font-mono text-center mb-4">
                      ABCD EFGH IJKL MNOP
                    </p>
                    <div className="mb-4">
                      <Input
                        placeholder="Enter 6-digit code from your app"
                        className="text-center"
                        maxLength={6}
                      />
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button size="sm">Verify</Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTwoFactorSetup(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* <FormField
                control={securityForm.control}
                name="loginNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Login Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive notifications for new login attempts
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={securityForm.control}
                name="sessionsManagement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Active Sessions Management
                      </FormLabel>
                      <FormDescription>
                        View and manage all devices logged into your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}

              <Button type="submit" disabled={isLoading} className="mt-2">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Save Security Settings
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t flex flex-col items-start">
          <div className="flex items-start gap-2 mt-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium text-foreground">
                Keep Your Account Secure
              </h4>
              <p className="mt-1">
                Never share your password with anyone. If you suspect your
                account has been compromised, change your password immediately
                and contact support.
              </p>
              <Button variant="link" className="px-0 h-auto py-1 text-primary">
                Review Security Best Practices
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
