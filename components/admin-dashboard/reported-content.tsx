"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink, Trash, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ReportedContent() {
  // Mock data - in a real app, this would come from an API
  const [reports, setReports] = useState([
    {
      id: "1",
      contentType: "Comment",
      reporter: "Ahmed Khan",
      reportedUser: "User123",
      reason: "Inappropriate content",
      date: "2023-04-20",
      status: "pending",
    },
    {
      id: "2",
      contentType: "Event",
      reporter: "Fatima Ali",
      reportedUser: "Imam456",
      reason: "Inaccurate information",
      date: "2023-04-19",
      status: "pending",
    },
    {
      id: "3",
      contentType: "Profile",
      reporter: "Omar Rahman",
      reportedUser: "MasjidABC",
      reason: "Misrepresentation",
      date: "2023-04-18",
      status: "pending",
    },
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleApprove = (id: string) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, status: "approved" as const } : report
      )
    );
  };

  const handleReject = (id: string) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, status: "rejected" as const } : report
      )
    );
  };

  return (
    <div className="rounded-md border">
      <ScrollArea className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Reporter</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead className="hidden md:table-cell">Reason</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Badge variant="outline">{report.contentType}</Badge>
                  <div className="md:hidden mt-1 text-xs text-muted-foreground">
                    <div>By: {report.reporter}</div>
                    <div>Reason: {report.reason}</div>
                    <div>{formatDate(report.date)}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell font-medium">
                  {report.reporter}
                </TableCell>
                <TableCell>{report.reportedUser}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {report.reason}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(report.date)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      report.status === "approved"
                        ? "default"
                        : report.status === "rejected"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    {report.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-green-500"
                          onClick={() => handleApprove(report.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleReject(report.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
