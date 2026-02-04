"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "@/firebase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getImamDonations,
  getImamLiveDonations,
} from "@/app/(dashboards)/imam/donations/action";
import { DollarSign, History, Wallet, Loader } from "lucide-react";

type DonationRecord = {
  id: string;
  amount: number;
  status: string;
  createdAt?: string;
  campaignId?: string;
  userId?: string;
  paymentIntentId?: string;
  message?: string;
  anonymous?: boolean;
  source: "campaign" | "livestream";
};
type LiveDonationRecord = {
  id: string;
  amount: number;
  status: string;
  createdAt?: string;
  userId?: string;
  imamId?: string;
  paymentIntentId?: string;
  message?: string;
  anonymous?: boolean;
  source: "livestream";
};

export default function Payments() {
  const [loading, setLoading] = useState<boolean>(true);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [liveDonations, setLiveDonations] = useState<LiveDonationRecord[]>([]);
  const [withdrawOpen, setWithdrawOpen] = useState<boolean>(false);

  const totalReceived = useMemo(() => {
    const all = [...donations, ...liveDonations];
    return all
      .filter(
        (d) =>
          (d.status || "").toLowerCase().includes("succeeded") ||
          (d.status || "").toLowerCase().includes("complete"),
      )
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [donations, liveDonations]);

  const totalCount = donations.length + liveDonations.length;

  const fetchData = useCallback(async () => {
    let isMounted = true;
    setLoading(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("User not authenticated");

      const [d1, d2] = await Promise.allSettled([
        getImamDonations(token),
        getImamLiveDonations(token),
      ]);

      console.log(d1, d2);

      const mapCampaign = (x: DonationRecord): DonationRecord => ({
        id: x.id,
        amount: x.amount,
        status: x.status,
        createdAt: x.createdAt,
        campaignId: x.campaignId,
        userId: x.userId,
        paymentIntentId: x.paymentIntentId,
        source: "campaign",
      });

      const mapLive = (x: LiveDonationRecord): LiveDonationRecord => ({
        id: x.id,
        amount: x.amount,
        status: x.status,
        createdAt: x.createdAt,
        userId: x.userId,
        imamId: x.imamId,
        paymentIntentId: x.paymentIntentId,
        message: x.message,
        anonymous: x.anonymous,
        source: "livestream",
      });

      if (!isMounted) return;

      const donationsData =
        d1.status === "fulfilled" && d1.value?.success
          ? (d1.value.donations ?? []).map(mapCampaign)
          : [];

      const liveData =
        d2.status === "fulfilled" && d2.value?.success
          ? (d2.value.donations ?? []).map(mapLive)
          : [];

      setDonations(donationsData);
      setLiveDonations(liveData);
    } catch (err) {
      console.error("Fetch donations failed:", err);
      if (isMounted) {
        setDonations([]);
        setLiveDonations([]);
      }
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) fetchData();
    });

    return () => unsub();
  }, [fetchData]);

  const allDonations: DonationRecord[] = useMemo(
    () =>
      [...donations, ...liveDonations].sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      }),
    [donations, liveDonations],
  );

  const statusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("pend"))
      return (
        <Badge variant="outline" className="border-yellow-400 text-yellow-600">
          Pending
        </Badge>
      );
    if (s.includes("fail")) return <Badge variant="destructive">Failed</Badge>;
    if (s.includes("complete") || s.includes("succeed"))
      return <Badge className="bg-green-600 text-white">Succeeded</Badge>;
    return <Badge variant="secondary">Unknown</Badge>;
  };

  const formatAmount = (n?: number) => (n ? `$${n.toFixed(2)}` : "$0.00");
  const shortPI = (id?: string) => (id ? `${id.slice(0, 8)}…` : "—");
  const fmtDate = (d?: string) => (d ? new Date(d).toLocaleString() : "—");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            View donations to your masjid and track history.
          </p>
        </div>
        <Button onClick={() => setWithdrawOpen(true)} className="gap-2">
          <Wallet className="h-4 w-4" />
          Withdraw
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Received
            </CardTitle>
            <CardDescription>Completed payments</CardDescription>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {formatAmount(totalReceived)}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <CardDescription>All sources</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalCount}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Activity
            </CardTitle>
            <CardDescription>Most recent update</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {allDonations[0]?.createdAt
              ? fmtDate(allDonations[0].createdAt)
              : "No activity yet"}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="campaign">Campaign</TabsTrigger>
          <TabsTrigger value="livestream">Livestream</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Donations</CardTitle>
              <CardDescription>
                Combined history from all sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Loading donations…
                </div>
              ) : allDonations.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No donations yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allDonations.map((d) => (
                      <TableRow key={`${d.source}-${d.id}`}>
                        <TableCell>{fmtDate(d.createdAt)}</TableCell>
                        <TableCell className="capitalize">{d.source}</TableCell>
                        <TableCell>{formatAmount(d.amount)}</TableCell>
                        <TableCell>{statusBadge(d.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {shortPI(d.paymentIntentId)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaign">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Donations</CardTitle>
              <CardDescription>
                Checkout and campaign-related payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Loading donations…
                </div>
              ) : donations.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No campaign donations yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((d) => (
                      <TableRow key={`don-${d.id}`}>
                        <TableCell>{fmtDate(d.createdAt)}</TableCell>
                        <TableCell>{d.campaignId ?? "—"}</TableCell>
                        <TableCell>{formatAmount(d.amount)}</TableCell>
                        <TableCell>{statusBadge(d.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {shortPI(d.paymentIntentId)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livestream">
          <Card>
            <CardHeader>
              <CardTitle>Livestream Donations</CardTitle>
              <CardDescription>
                Direct donations during livestreams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Loading donations…
                </div>
              ) : liveDonations.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No livestream donations yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Anonymous</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveDonations.map((d) => (
                      <TableRow key={`live-${d.id}`}>
                        <TableCell>{fmtDate(d.createdAt)}</TableCell>
                        <TableCell>{formatAmount(d.amount)}</TableCell>
                        <TableCell>{statusBadge(d.status)}</TableCell>
                        <TableCell>
                          {d.anonymous ? (
                            <Badge>Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell
                          className="max-w-[300px] truncate"
                          title={d.message || ""}
                        >
                          {d.message || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {shortPI(d.paymentIntentId)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Stripe Connect integration coming soon.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Withdrawals will be processed via Stripe Connect. You will be able
              to link your bank account and request payouts directly from this
              dashboard.
            </p>
            <p>In the meantime, track incoming donations above.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
              Close
            </Button>
            <Button disabled>Request Withdrawal</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
