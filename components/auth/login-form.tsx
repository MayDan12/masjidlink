"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import GoogleButton from "./google-button";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { getMasjidById } from "@/app/(dashboards)/dashboard/masjids/action";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Changed from useParams() to useSearchParams()
  const redirect = searchParams.get("from") || searchParams.get("redirect"); // Get the redirect parameter

  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn(data.email, data.password);

      if (!result?.user) {
        throw new Error("Invalid login credentials.");
      }

      const userRole = result.role;
      if (!userRole) throw new Error("Unauthorized: No role assigned.");

      // Special handling for imam
      if (userRole === "imam") {
        const imamProfile = await getMasjidById(result.user.user.uid);
        if (!imamProfile) {
          throw new Error("Imam profile not found.");
        }

        if (!imamProfile.data.imamApproved) {
          // Block login entirely
          // how do i make the gmail copyable when clicking the toast
          toast.error(
            "Imam profile is not complete. Please contact the admin at masjidlink6@gmail.com",
            {
              position: "top-right",
              onDismiss: () => {
                navigator.clipboard.writeText("masjidlink6@gmail.com");
                toast.success("Email copied to clipboard!");
              },
            },
          );
          setErrorMessage(
            "Imam profile is not complete. Please contact the admin at masjidlink6@gmail.com",
          );
          return; // <-- STOP here, no redirects
        }

        toast.success("Imam profile is complete. You can now log in.", {
          position: "top-right",
        });

        // Approved imam goes to their dashboard
        router.push("/imam");
        return; // <-- ensure nothing else runs
      }

      // Show success toast for non-imam users
      toast("Login successful", {
        description: "You are now logged in.",
        duration: 2000,
      });

      // Redirect if redirect query exists
      if (redirect) {
        router.push(decodeURIComponent(redirect));
        return;
      }

      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        admin: "/admin",
        user: "/dashboard",
      };
      router.push(roleRoutes[userRole] ?? "/login");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>Sign in</>
            )}
          </Button>
        </form>
      </Form>
      {errorMessage && <p className="text-center">{errorMessage}</p>}
      <div className="relative">
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
