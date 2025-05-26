"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Download, Search, FileText } from "lucide-react";

type Donation = {
  id: string;
  date: Date;
  amount: number;
  campaign: string;
  masjid: string;
  category: string;
  receiptAvailable: boolean;
  taxDeductible: boolean;
};

export function DonationHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock donations data
  const donations: Donation[] = [
    {
      id: "D12345",
      date: new Date(2023, 11, 15),
      amount: 250,
      campaign: "Masjid Expansion Project",
      masjid: "Masjid Al-Noor",
      category: "construction",
      receiptAvailable: true,
      taxDeductible: true,
    },
    {
      id: "D12346",
      date: new Date(2023, 10, 5),
      amount: 100,
      campaign: "Weekend Islamic School",
      masjid: "Islamic Center",
      category: "education",
      receiptAvailable: true,
      taxDeductible: true,
    },
    {
      id: "D12347",
      date: new Date(2023, 9, 20),
      amount: 50,
      campaign: "Community Support Fund",
      masjid: "Islamic Center",
      category: "charity",
      receiptAvailable: true,
      taxDeductible: true,
    },
    {
      id: "D12348",
      date: new Date(2023, 8, 10),
      amount: 75,
      campaign: "Ramadan Food Drive",
      masjid: "Masjid Al-Rahman",
      category: "ramadan",
      receiptAvailable: true,
      taxDeductible: true,
    },
    {
      id: "D12349",
      date: new Date(2023, 7, 1),
      amount: 30,
      campaign: "New Carpet for Prayer Hall",
      masjid: "Masjid Al-Taqwa",
      category: "construction",
      receiptAvailable: true,
      taxDeductible: true,
    },
  ];

  // Filter donations based on search query and filters
  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.masjid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear =
      yearFilter === "all" ||
      donation.date.getFullYear().toString() === yearFilter;

    const matchesCategory =
      categoryFilter === "all" || donation.category === categoryFilter;

    return matchesSearch && matchesYear && matchesCategory;
  });

  // Calculate total amount
  const totalAmount = filteredDonations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search donations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="charity">Charity</SelectItem>
              <SelectItem value="ramadan">Ramadan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h3 className="font-medium">Donation Summary</h3>
              <p className="text-sm text-muted-foreground">
                {filteredDonations.length} donations, total: $
                {totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                <span>Tax Year</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Masjid</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      {donation.date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{donation.id}</TableCell>
                    <TableCell>{donation.campaign}</TableCell>
                    <TableCell>{donation.masjid}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${donation.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Download Receipt</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDonations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No donations found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Need help with your donation history or tax receipts?</p>
        <Button variant="link" className="h-auto p-0">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
