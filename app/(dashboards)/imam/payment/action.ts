"use server";

import { firestore, serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function getImamStripeStatus(token: string) {
  try {
    const decoded = await serverAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const role = await checkUserRole(uid);
    if (role !== "imam") {
      return { error: "Unauthorized" };
    }

    const doc = await firestore.collection("imams").doc(uid).get();
    const data = doc.data();
    const stripeAccountId = data?.stripeAccountId;
    let stripeConnected = !!data?.stripeConnected;
    let detailsSubmitted = !!data?.stripeDetailsSubmitted;

    if (stripeAccountId) {
      // Refresh status from Stripe to be sure
      try {
        const account = await stripe.accounts.retrieve(stripeAccountId);
        const isDetailsSubmitted = account.details_submitted;
        const isPayoutsEnabled = account.payouts_enabled;

        // Update if changed
        if (
          isDetailsSubmitted !== detailsSubmitted ||
          isPayoutsEnabled !== stripeConnected
        ) {
          await firestore
            .collection("imams")
            .doc(uid)
            .update({
              stripeDetailsSubmitted: isDetailsSubmitted,
              stripeConnected: isPayoutsEnabled,
              stripeAccountStatus: account.requirements?.currently_due?.length
                ? "incomplete"
                : "complete",
            });
          detailsSubmitted = isDetailsSubmitted;
          stripeConnected = isPayoutsEnabled;
        }
      } catch (stripeError) {
        console.error("Stripe retrieve error:", stripeError);
        // Fallback to existing data if Stripe fails
      }
    }

    return {
      connected: stripeConnected,
      accountId: stripeAccountId,
      detailsSubmitted: detailsSubmitted,
    };
  } catch (error: unknown) {
    console.error("Error fetching stripe status:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { error: msg };
  }
}

export async function createStripeLoginLink(token: string) {
  try {
    const decoded = await serverAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const role = await checkUserRole(uid);
    if (role !== "imam") {
      return { error: "Unauthorized" };
    }

    const doc = await firestore.collection("imams").doc(uid).get();
    const data = doc.data();

    if (!data?.stripeAccountId) {
      return { error: "No Stripe account found" };
    }

    const loginLink = await stripe.accounts.createLoginLink(
      data.stripeAccountId,
    );

    return { url: loginLink.url };
  } catch (error: unknown) {
    console.error("Error creating login link:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { error: msg };
  }
}
