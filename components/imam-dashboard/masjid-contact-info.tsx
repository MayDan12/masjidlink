"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  getMasjidProfile,
  saveMasjidSocials,
} from "@/app/(dashboards)/imam/profile/action";
import { auth } from "@/firebase/client";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
});

export function MasjidContactInfo() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
      website: "",
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
    },
  });

  useEffect(() => {
    const fetchMasjidProfile = async () => {
      try {
        const token = await auth?.currentUser?.getIdToken();
        if (!token) {
          toast("Error", {
            description: "Unable to retrieve authentication token.",
          });
          return;
        }

        const response = await getMasjidProfile(token);

        if (response.success && response.data) {
          const data = response.data.social;
          // Check if data is empty
          if (!data) {
            toast("No Data", {
              description: "Add contact info.",
            });
            return;
          }

          // Set form values with fetched data
          form.reset({
            email: data.email || "",
            phone: data.phone || "",
            website: data.website || "",
            facebook: data.facebook || "",
            twitter: data.twitter || "",
            instagram: data.instagram || "",
            youtube: data.youtube || "",
          });
        } else {
          toast("Error", {
            description: "Failed to fetch masjid profile.",
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast("Error", {
          description: "Something went wrong. Please try again.",
        });
      }
    };

    fetchMasjidProfile();
  }, [form]);

  // Handle form submission
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        toast("Error", {
          description: "Unable to retrieve authentication token.",
        });
        return;
      }

      const response = await saveMasjidSocials({ ...data, token });

      if (response.success) {
        toast("Saved Successfully", {
          description: "Masjid contact saved successfully.",
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        });
      } else {
        toast("Error", {
          description: response.message || "An error occurred while saving.",
        });
      }

      console.log(response);
    } catch (error) {
      console.error("Submit Error:", error);
      toast("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Update your masjid&apos;s contact information and social media
          profiles.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormDescription>
                      This email will be displayed publicly for contact
                      purposes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormDescription>
                      This phone number will be displayed publicly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.yourmasjid.org"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your masjid&apos;s official website (if available).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">
                Social Media Profiles
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <div className="flex">
                        <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                          facebook.com/
                        </div>
                        <FormControl>
                          <Input
                            className="rounded-l-none"
                            placeholder="username"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <div className="flex">
                        <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                          twitter.com/
                        </div>
                        <FormControl>
                          <Input
                            className="rounded-l-none"
                            placeholder="username"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <div className="flex">
                        <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                          instagram.com/
                        </div>
                        <FormControl>
                          <Input
                            className="rounded-l-none"
                            placeholder="username"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube</FormLabel>
                      <div className="flex">
                        <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                          youtube.com/
                        </div>
                        <FormControl>
                          <Input
                            className="rounded-l-none"
                            placeholder="channel"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
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
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
