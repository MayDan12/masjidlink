// hooks/useCampaignDonation.ts

import { useAuth } from "@/context/auth";
import { auth } from "@/firebase/client";
import { useState } from "react";
import { toast } from "sonner";

export const useCampaignDonation = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const base = process.env.NEXT_PUBLIC_API_URL;
  const intentUrl = base
    ? `${base}/api/donations/campaign/intent`
    : `/api/donations/campaign/intent`;
  const checkoutUrl = base
    ? `${base}/api/donations/campaign/checkout`
    : `/api/donations/campaign/checkout`;
  const confirmUrl = base
    ? `${base}/api/donations/campaign/confirm`
    : `/api/donations/campaign/confirm`;

  const createDonationIntent = async (campaignId: string, amount: number) => {
    if (!user) {
      toast.error("Please login to make a donation");
      return null;
    }

    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return null;
    }

    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(intentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId,
          amount,
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : await response.text().then((t) => {
            throw new Error(
              t?.slice(0, 120) || "Unexpected response from donation intent",
            );
          });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create donation";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createDonationCheckoutSession = async (
    campaignId: string,
    amount: number,
  ) => {
    if (!user) {
      toast.error("Please login to make a donation");
      return null;
    }
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return null;
    }
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User not authenticated");
      }
      const response = await fetch(checkoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId,
          amount,
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : await response.text().then((t) => {
            throw new Error(
              t?.slice(0, 120) || "Unexpected response from checkout",
            );
          });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start checkout";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const confirmDonation = async (paymentIntentId: string) => {
    if (!user) {
      toast.error("User not authenticated");
      return null;
    }

    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(confirmUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentIntentId,
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : await response.text().then((t) => {
            throw new Error(
              t?.slice(0, 120) || "Unexpected response from donation confirm",
            );
          });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(`Thank you for your donation of $${result.amount}!`);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to confirm donation";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDonationIntent,
    createDonationCheckoutSession,
    confirmDonation,
    loading,
  };
};
