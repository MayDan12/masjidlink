"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, MinusCircle, Plus, Search } from "lucide-react";

// Mock data for subscribed masjids and communities
const subscriptionsData = [
  {
    id: 1,
    name: "Masjid Al-Noor",
    type: "masjid",
    location: "Chicago, IL",
    enabled: true,
    primary: true,
  },
  {
    id: 2,
    name: "Downtown Islamic Center",
    type: "masjid",
    location: "Chicago, IL",
    enabled: true,
    primary: false,
  },
  {
    id: 3,
    name: "Muslims of Chicago",
    type: "community",
    location: "Chicago, IL",
    enabled: true,
    primary: false,
  },
  {
    id: 4,
    name: "Masjid Al-Rahman",
    type: "masjid",
    location: "Milwaukee, WI",
    enabled: false,
    primary: false,
  },
  {
    id: 5,
    name: "Muslim Youth Group",
    type: "community",
    location: "Chicago, IL",
    enabled: true,
    primary: false,
  },
];

// Mock data for suggested masjids and communities
const suggestionsData = [
  {
    id: 101,
    name: "Masjid Al-Taqwa",
    type: "masjid",
    location: "Chicago, IL",
  },
  {
    id: 102,
    name: "Islamic Educational Center",
    type: "masjid",
    location: "Evanston, IL",
  },
  {
    id: 103,
    name: "Muslims in Healthcare",
    type: "community",
    location: "Chicago, IL",
  },
];

export function AlertsSubscriptions() {
  const [subscriptions, setSubscriptions] = useState(subscriptionsData);
  const [suggestions, setSuggestions] = useState(suggestionsData);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to toggle subscription status
  const toggleSubscription = (id: number) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === id ? { ...sub, enabled: !sub.enabled } : sub
      )
    );
  };

  // Function to add a new subscription
  const addSubscription = (suggestion: (typeof suggestionsData)[0]) => {
    setSubscriptions([
      ...subscriptions,
      {
        ...suggestion,
        enabled: true,
        primary: false,
      },
    ]);
    setSuggestions(suggestions.filter((s) => s.id !== suggestion.id));
  };

  // Function to remove a subscription
  const removeSubscription = (id: number) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search subscriptions..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No subscriptions found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-1">
                      {subscription.name}
                      {subscription.primary && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-50 text-green-700 border-green-200"
                        >
                          Primary
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        subscription.type === "masjid"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-purple-200 bg-purple-50 text-purple-700"
                      }
                    >
                      {subscription.type === "masjid" ? "Masjid" : "Community"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {subscription.location}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={subscription.enabled}
                        onCheckedChange={() =>
                          toggleSubscription(subscription.id)
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {subscription.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeSubscription(subscription.id)}
                      className="h-7 w-7"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Suggested Subscriptions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{suggestion.name}</span>
                  <Badge
                    variant="outline"
                    className={
                      suggestion.type === "masjid"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-purple-200 bg-purple-50 text-purple-700"
                    }
                  >
                    {suggestion.type === "masjid" ? "Masjid" : "Community"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {suggestion.location}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => addSubscription(suggestion)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              About Alert Subscriptions
            </p>
            <p className="mt-1">
              You will receive alerts from all subscribed masjids and
              communities that are enabled. Your primary masjid&apos;s alerts
              will always be prioritized. Manage your alert types and
              notification preferences in Alert Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
