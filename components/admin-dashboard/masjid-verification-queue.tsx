"use client";

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
import { Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types/user";

export function MasjidVerificationQueue({ masjids }: { masjids: User[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleVerify = (id: string) => {
    // setVerificationRequests(
    //   verificationRequests.map((req) =>
    //     req.id === id ? { ...req, status: "verified" as const } : req,
    //   ),
    // );
  };

  const handleReject = (id: string) => {
    // setVerificationRequests(
    //   verificationRequests.map((req) =>
    //     req.id === id ? { ...req, status: "rejected" as const } : req,
    //   ),
    // );
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
                Denominations
              </TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {masjids.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.name}
                  <div className="md:hidden mt-1 text-xs text-muted-foreground">
                    <div>{request.denomination}</div>
                    <div>{request.name}</div>
                    <div>{formatDate(request.createdAt)}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {request.state} {request.country}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {request.denomination}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(request.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.imamApproved === true ? "secondary" : "outline"
                    }
                  >
                    {request.imamApproved === true ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button> */}
                    {request.imamApproved === false && (
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
                    {request.imamApproved === true && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-green-500"
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approved</span>
                      </Button>
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
