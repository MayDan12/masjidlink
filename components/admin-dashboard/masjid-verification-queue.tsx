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
import { Check, Eye, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MasjidVerificationQueue() {
  // Mock data - in a real app, this would come from an API
  const [verificationRequests, setVerificationRequests] = useState([
    {
      id: "1",
      name: "Masjid Al-Falah",
      location: "123 Main St, City",
      contactPerson: "Imam Abdullah",
      dateSubmitted: "2023-04-15",
      status: "pending",
    },
    {
      id: "2",
      name: "Islamic Center of Springfield",
      location: "456 Oak Ave, Springfield",
      contactPerson: "Imam Mohammed",
      dateSubmitted: "2023-04-18",
      status: "pending",
    },
    {
      id: "3",
      name: "Masjid An-Noor",
      location: "789 Elm St, Riverside",
      contactPerson: "Imam Ali",
      dateSubmitted: "2023-04-20",
      status: "pending",
    },
    {
      id: "4",
      name: "Baitul Islam Mosque",
      location: "101 Cedar Rd, Northside",
      contactPerson: "Imam Yusuf",
      dateSubmitted: "2023-04-21",
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

  const handleVerify = (id: string) => {
    setVerificationRequests(
      verificationRequests.map((req) =>
        req.id === id ? { ...req, status: "verified" as const } : req
      )
    );
  };

  const handleReject = (id: string) => {
    setVerificationRequests(
      verificationRequests.map((req) =>
        req.id === id ? { ...req, status: "rejected" as const } : req
      )
    );
  };

  return (
    <div className="rounded-md border">
      <ScrollArea className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Masjid Name</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">
                Contact Person
              </TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verificationRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.name}
                  <div className="md:hidden mt-1 text-xs text-muted-foreground">
                    <div>{request.location}</div>
                    <div>{request.contactPerson}</div>
                    <div>{formatDate(request.dateSubmitted)}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {request.location}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {request.contactPerson}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(request.dateSubmitted)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === "verified"
                        ? "default"
                        : request.status === "rejected"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-green-500"
                          onClick={() => handleVerify(request.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Verify</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </>
                    )}
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
