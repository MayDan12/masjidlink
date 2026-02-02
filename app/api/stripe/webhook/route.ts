export const runtime = "nodejs";

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/firebase/server";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  console.log(`[Webhook] Received event: ${event.type} (ID: ${event.id})`);

  // ===================================================================
  // PRIMARY HANDLER: checkout.session.completed
  // This is the PREFERRED place to update campaign amounts for checkout sessions
  // ===================================================================
  if (event.type === "checkout.session.completed") {
    console.log(`[Webhook] Processing checkout.session.completed ${event.id}`);
    const session = event.data.object as Stripe.Checkout.Session;
    const donationId = session.metadata?.donationId;
    const campaignId = session.metadata?.campaignId;
    const amountTotal = session.amount_total ?? 0; // In cents
    const amountInDollars = amountTotal / 100;

    console.log(
      `[Webhook] Session DonationID: ${donationId}, CampaignID: ${campaignId}, Amount: ${amountTotal}`,
    );

    if (!donationId) {
      console.log("[Webhook] No donationId in session metadata, skipping");
      return NextResponse.json({ received: true });
    }

    if (session.payment_status !== "paid") {
      console.log(
        `[Webhook] Payment not completed yet: ${session.payment_status}`,
      );
      return NextResponse.json({ received: true });
    }

    const donationRef = firestore.collection("donations").doc(donationId);
    const campaignRef = campaignId
      ? firestore.collection("campaigns").doc(campaignId)
      : null;

    try {
      await firestore.runTransaction(async (transaction) => {
        const donationDoc = await transaction.get(donationRef);

        if (!donationDoc.exists) {
          throw new Error("Donation not found");
        }

        const donationData = donationDoc.data();

        // Check if already processed
        if (donationData?.amountProcessed === true) {
          console.log("[Webhook] Session: Already processed, skipping");
          return;
        }

        // Check status
        if (
          donationData?.status === "succeeded" ||
          donationData?.status === "completed"
        ) {
          console.log(
            "[Webhook] Session: Status already succeeded/completed, skipping",
          );
          return;
        }

        // Update donation
        transaction.update(donationRef, {
          status: "succeeded",
          amount: amountInDollars,
          amountProcessed: true,
          paymentIntentId: session.payment_intent as string,
          checkoutSessionId: session.id,
          processedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        // Update campaign
        if (campaignRef && amountInDollars > 0) {
          console.log("[Webhook] Session: Incrementing campaign");
          transaction.update(campaignRef, {
            amountRaised: FieldValue.increment(amountInDollars),
            updatedAt: Timestamp.now(),
          });
        }
      });
    } catch (error) {
      console.error(`[Webhook] Session Transaction failed:`, error);
      return NextResponse.json(
        { error: "Transaction failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ received: true });
  }

  // ===================================================================
  // SECONDARY HANDLER: payment_intent.succeeded
  // Only processes payment intents NOT created by checkout sessions
  // ===================================================================
  if (event.type === "payment_intent.succeeded") {
    console.log(`[Webhook] Processing payment_intent.succeeded ${event.id}`);
    const pi = event.data.object as Stripe.PaymentIntent;

    // 1. Metadata Check
    if (pi.metadata?.source === "checkout") {
      console.log(
        "[Webhook] PI: Source is checkout, skipping (handled by Session)",
      );
      return NextResponse.json({ received: true });
    }

    const donationId = pi.metadata?.donationId;
    const campaignId = pi.metadata?.campaignId;
    const amountInDollars = (pi.amount_received ?? 0) / 100;

    if (!donationId) {
      console.log("[Webhook] PI: No donationId, skipping");
      return NextResponse.json({ received: true });
    }

    const donationRef = firestore.collection("donations").doc(donationId);
    const campaignRef = campaignId
      ? firestore.collection("campaigns").doc(campaignId)
      : null;

    try {
      await firestore.runTransaction(async (transaction) => {
        const donationDoc = await transaction.get(donationRef);

        if (!donationDoc.exists) {
          throw new Error("Donation not found");
        }

        const donationData = donationDoc.data();

        // 2. Database Field Check (Stronger than Metadata)
        // If the donation has a checkoutSessionId field, it WAS created via checkout
        // So we MUST let the checkout.session.completed handler process it
        if (donationData?.checkoutSessionId) {
          console.log(
            "[Webhook] PI: Donation has checkoutSessionId, skipping (handled by Session)",
          );
          return;
        }

        // Check if already processed
        if (donationData?.amountProcessed === true) {
          console.log("[Webhook] PI: Already processed, skipping");
          return;
        }

        if (
          donationData?.status === "succeeded" ||
          donationData?.status === "completed"
        ) {
          console.log(
            "[Webhook] PI: Status already succeeded/completed, skipping",
          );
          return;
        }

        // Update donation
        transaction.update(donationRef, {
          status: "succeeded",
          amount: amountInDollars,
          amountProcessed: true,
          paymentIntentId: pi.id,
          processedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        // Update campaign
        if (campaignRef && amountInDollars > 0) {
          console.log("[Webhook] PI: Incrementing campaign");
          transaction.update(campaignRef, {
            amountRaised: FieldValue.increment(amountInDollars),
            updatedAt: Timestamp.now(),
          });
        }
      });
    } catch (error) {
      console.error(`[Webhook] PI Transaction failed:`, error);
      return NextResponse.json(
        { error: "Transaction failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
