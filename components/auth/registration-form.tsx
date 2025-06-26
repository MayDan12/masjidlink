"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
// import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Loader2,
  UserPlus,
  Check,
  EyeOff,
  Eye,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleButton from "./google-button";

// Form validation schema
const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    role: z.enum(["user", "imam"]),
    masjidName: z.string().optional(),
    masjidAddress: z.string().optional(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "imam") {
        return !!data.masjidName && !!data.masjidAddress;
      }
      return true;
    },
    {
      message: "Masjid information is required for Imam accounts.",
      path: ["masjidName"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      termsAccepted: false,
    },
  });

  // Watch role to conditionally render fields
  const role = form.watch("role");

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      setRegistered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Registration Successful!</h3>
        <p className="text-center text-muted-foreground">
          Thank you for joining MasjidLink. We&apos;ve sent a verification email
          to your address.
        </p>
        <Button asChild className="mt-4 w-full max-w-xs">
          <Link href="/login">
            Continue to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[450px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            defaultValue="user"
            value={role}
            onValueChange={(value) =>
              form.setValue("role", value as "user" | "imam")
            }
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user" className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Community Member</span>
              </TabsTrigger>
              <TabsTrigger value="imam" className="gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M8 19H5c-1.105 0-1.99-.895-1.99-2 0-1-.006-1.909 0-3.003.006-1.14.118-1.998 1.246-1.998 1-.002 2.995 0 3.744 0"></path>
                  <path d="M19 19h-4c-1.105 0-2-.895-2-2 0-1 0-8 1.248-8 1 0 3.332 0 4.752 0 1 0 1-.001 1 1 0 1 0 7-.996 9Z"></path>
                  <path d="M8 19c0-3.79.229-6.295 1.558-7.578"></path>
                  <path d="M9.25 7.825A5.5 5.5 0 0 1 14.5 3a5.5 5.5 0 0 1 5.204 3.663c.72.058.14.118.209.177.773.65 1.08.978 1.084 1.374.004.397-.295.723-1.084 1.376-.01.007-.018.015-.027.022"></path>
                </svg>
                <span>Imam/Masjid Admin</span>
              </TabsTrigger>
            </TabsList>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormControl>
                  <input type="hidden" {...field} />
                </FormControl>
              )}
            />

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showConfirmPassword
                                ? "Hide password"
                                : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <TabsContent
                value="imam"
                className="mt-4 space-y-4 border rounded-lg p-4"
              >
                <h3 className="font-medium">Masjid Information</h3>
                <FormField
                  control={form.control}
                  name="masjidName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Masjid Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter masjid name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="masjidAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Masjid Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter masjid address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          privacy policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </Tabs>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>Create account</>
            )}
          </Button>
        </form>
      </Form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GoogleButton />
        <Button variant="outline" className="bg-background">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-facebook mr-2 h-4 w-4 text-[#1877F2]"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
          Facebook
        </Button>
      </div>
    </div>
  );
}
