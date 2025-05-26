"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Bell, CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for alerts history
const alertsData = [
  {
    id: 1,
    title: "Masjid Closure Due to Weather",
    masjid: "Masjid Al-Noor",
    category: "weather",
    date: "2023-04-15T08:30:00Z",
    severity: "medium",
  },
  {
    id: 2,
    title: "Prayer Time Change for Ramadan",
    masjid: "Downtown Islamic Center",
    category: "schedule",
    date: "2023-03-22T17:00:00Z",
    severity: "low",
  },
  {
    id: 3,
    title: "Building Evacuation Due to Gas Leak",
    masjid: "Masjid Al-Rahman",
    category: "safety",
    date: "2023-02-10T14:20:00Z",
    severity: "high",
  },
  {
    id: 4,
    title: "Schedule Changes Due to Special Event",
    masjid: "Islamic Center",
    category: "schedule",
    date: "2023-01-28T09:15:00Z",
    severity: "low",
  },
  {
    id: 5,
    title: "Health Alert: Flu Outbreak in Community",
    masjid: "Masjid Al-Taqwa",
    category: "health",
    date: "2023-01-15T11:10:00Z",
    severity: "medium",
  },
  {
    id: 6,
    title: "Facility Maintenance: Temporary Closure",
    masjid: "Masjid Al-Noor",
    category: "facility",
    date: "2022-12-05T10:00:00Z",
    severity: "low",
  },
  {
    id: 7,
    title: "Emergency Shelter Activation",
    masjid: "Downtown Islamic Center",
    category: "community",
    date: "2022-11-20T16:45:00Z",
    severity: "high",
  },
];

export function AlertsHistory() {
  const [filter, setFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  // Filter alerts based on the active filter
  const filteredAlerts = alertsData.filter((alert) => {
    const categoryMatch = filter === "all" || alert.category === filter;
    const severityMatch =
      severityFilter === "all" || alert.severity === severityFilter;
    return categoryMatch && severityMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing alerts from the past 6 months
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="weather">Weather</SelectItem>
              <SelectItem value="schedule">Schedule Changes</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="facility">Facility</SelectItem>
              <SelectItem value="community">Community</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity Levels</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              No alerts match your current filters.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setFilter("all");
                setSeverityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[400px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead className="hidden md:table-cell">Masjid</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow
                  key={alert.id}
                  className="cursor-pointer hover:bg-accent/50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {alert.severity === "high" && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      {alert.title}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {alert.masjid}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={
                        alert.category === "safety" ||
                        alert.category === "health"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }
                    >
                      {alert.category.charAt(0).toUpperCase() +
                        alert.category.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(alert.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        alert.severity === "high"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : alert.severity === "medium"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-green-200 bg-green-50 text-green-700"
                      }
                    >
                      {alert.severity.charAt(0).toUpperCase() +
                        alert.severity.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-muted-foreground"
        >
          Load More Alerts
        </Button>
      </div>
    </div>
  );
}
