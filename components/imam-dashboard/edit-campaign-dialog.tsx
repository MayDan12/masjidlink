"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/firebase/client";
import {
  getDonationById,
  editDonationCampaign,
} from "@/app/(dashboards)/imam/donations/action";

type Campaign = {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  amountRaised: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming" | "archived";
  category: "general" | "construction" | "education" | "charity" | "emergency";
  createdAt?: string;
  updatedAt?: string;
};

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  goal_amount: z.string().min(1, {
    message: "Fundraising goal is required.",
  }),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }),
  endDate: z.string().min(1, {
    message: "End date is required.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  // isPublic: z.boolean(),
  // allowAnonymous: z.boolean(),
  // showProgress: z.boolean(),
});

export function EditCampaignDialog({
  children,
  campaign,
  onSuccess,
}: {
  children: React.ReactNode;
  campaign: Campaign;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: campaign.title,
      description: campaign.description,
      goal_amount: campaign.goal_amount.toString(),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      category: campaign.category,
      // isPublic: true,
      // allowAnonymous: true,
      // showProgress: true,
    },
  });

  useEffect(() => {
    const fetchCampaignById = async () => {
      try {
        const response = await getDonationById(campaign.id);
        if (!response.success || !response.campaign) {
          throw new Error("Campaign not found");
        }

        if (response.success) {
          form.reset({
            title: response.campaign.title || "",
            description: response.campaign.description || "",
            goal_amount: response.campaign.goal_amount.toString(),
            startDate: response.campaign.startDate || "",
            endDate: response.campaign.endDate || "",
            category: response.campaign.category || "",
          });
        } else {
          toast({
            title: "Error fetching campaign",
            description: response.message,
          });
        }
      } catch (error) {
        toast({
          title: "Error fetching campaign",
          description: (error as Error).message,
        });
      }
    };
    fetchCampaignById();
  }, [campaign.id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await editDonationCampaign(campaign.id, {
        title: values.title,
        description: values.description,
        goal_amount: parseFloat(values.goal_amount),
        startDate: values.startDate,
        endDate: values.endDate,
        category: values.category,
        token,
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      setIsLoading(false);
      form.reset();
      toast({
        title: "Campaign updated",
        description: "Your donation campaign has been successfully updated.",
      });
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Error updating campaign",
        description: (error as Error).message,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Donation Campaign</DialogTitle>
          <DialogDescription>
            Update the details of your existing donation campaign.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter campaign description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain the purpose of this campaign and how funds will be
                    used.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="goal_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fundraising Goal ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="charity">Charity</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Public Campaign</FormLabel>
                      <FormDescription>
                        Make visible to everyone?
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
                control={form.control}
                name="allowAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Anonymous Donations</FormLabel>
                      <FormDescription>Allow anonymous giving?</FormDescription>
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
                control={form.control}
                name="showProgress"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Show Progress</FormLabel>
                      <FormDescription>Display progress bar?</FormDescription>
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
            </div> */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>Update Campaign</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
