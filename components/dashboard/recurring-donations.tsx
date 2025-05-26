"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  CreditCard,
  Calendar,
  Edit,
  Trash2,
  PlusCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

type RecurringDonation = {
  id: string;
  amount: number;
  frequency: "weekly" | "monthly" | "quarterly" | "annually";
  campaign: string;
  masjid: string;
  nextDate: Date;
  paymentMethod: string;
  active: boolean;
};

type PaymentMethod = {
  id: string;
  type: "card" | "bank";
  name: string;
  last4: string;
  expiry?: string;
  isDefault: boolean;
};

export function RecurringDonations() {
  const [activeTab, setActiveTab] = useState("donations");

  // Mock recurring donations data
  const recurringDonations: RecurringDonation[] = [
    {
      id: "R12345",
      amount: 50,
      frequency: "monthly",
      campaign: "Masjid Expansion Project",
      masjid: "Masjid Al-Noor",
      nextDate: new Date(new Date().setDate(new Date().getDate() + 15)),
      paymentMethod: "Visa •••• 4242",
      active: true,
    },
    {
      id: "R12346",
      amount: 25,
      frequency: "monthly",
      campaign: "Weekend Islamic School",
      masjid: "Islamic Center",
      nextDate: new Date(new Date().setDate(new Date().getDate() + 8)),
      paymentMethod: "Mastercard •••• 5555",
      active: true,
    },
    {
      id: "R12347",
      amount: 100,
      frequency: "quarterly",
      campaign: "Community Support Fund",
      masjid: "Islamic Center",
      nextDate: new Date(new Date().setDate(new Date().getDate() + 45)),
      paymentMethod: "Bank Account •••• 9876",
      active: false,
    },
  ];

  // Mock payment methods data
  const paymentMethods: PaymentMethod[] = [
    {
      id: "P12345",
      type: "card",
      name: "Visa",
      last4: "4242",
      expiry: "05/25",
      isDefault: true,
    },
    {
      id: "P12346",
      type: "card",
      name: "Mastercard",
      last4: "5555",
      expiry: "08/24",
      isDefault: false,
    },
    {
      id: "P12347",
      type: "bank",
      name: "Chase Bank",
      last4: "9876",
      isDefault: false,
    },
  ];

  const toggleDonationStatus = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Toggle status for donation ${id}`);
  };

  const setDefaultPaymentMethod = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Set payment method ${id} as default`);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="donations">Recurring Donations</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Your Recurring Donations</h3>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>New Donation</span>
            </Button>
          </div>

          {recurringDonations.length > 0 ? (
            <div className="space-y-4">
              {recurringDonations.map((donation) => (
                <Card
                  key={donation.id}
                  className={!donation.active ? "opacity-70" : ""}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            ${donation.amount.toLocaleString()}
                          </h4>
                          <Badge variant="outline" className="capitalize">
                            {donation.frequency}
                          </Badge>
                          {!donation.active && (
                            <Badge variant="outline" className="bg-muted">
                              Paused
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mt-1">{donation.campaign}</p>
                        <p className="text-sm text-muted-foreground">
                          {donation.masjid}
                        </p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>
                            Next payment:{" "}
                            {donation.nextDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CreditCard className="h-3.5 w-3.5 mr-1" />
                          <span>{donation.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={donation.active}
                          onCheckedChange={() =>
                            toggleDonationStatus(donation.id)
                          }
                        />
                        <span className="text-sm">
                          {donation.active ? "Active" : "Paused"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel recurring donation?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will stop your ${donation.amount}{" "}
                                {donation.frequency} donation to{" "}
                                {donation.campaign}. This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Keep Donation
                              </AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive text-destructive-foreground">
                                Cancel Donation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No Recurring Donations
              </h3>
              <p className="text-muted-foreground mb-4">
                You don&apos;t have any recurring donations set up yet.
              </p>
              <Button>Set Up a Recurring Donation</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Your Payment Methods</h3>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add Payment Method</span>
            </Button>
          </div>

          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted h-10 w-10 rounded-md flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {method.name} •••• {method.last4}
                            </h4>
                            {method.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.type === "card"
                              ? `Expires ${method.expiry}`
                              : "Bank Account"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDefaultPaymentMethod(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove payment method?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove {method.name} ••••{" "}
                                {method.last4} from your account. Any recurring
                                donations using this payment method will be
                                paused.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive text-destructive-foreground">
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
              <p className="text-muted-foreground mb-4">
                You don&apos;t have any payment methods saved yet.
              </p>
              <Button>Add Payment Method</Button>
            </div>
          )}

          <div className="flex items-center gap-2 p-4 border rounded-md bg-muted/50">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your payment information is securely stored and processed by our
              payment provider. We never store your full card details.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
