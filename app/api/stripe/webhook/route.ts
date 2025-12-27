// app/api/stripe/webhook/route.ts
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
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const donationId = session.metadata?.donationId;
    const campaignId = session.metadata?.campaignId;
    const amountTotal = session.amount_total ?? 0;

    if (donationId) {
      await firestore
        .collection("donations")
        .doc(donationId)
        .update({
          status: "succeeded",
          amount: amountTotal / 100,
          updatedAt: Timestamp.now(),
        });
    }

    if (campaignId && amountTotal > 0) {
      await firestore
        .collection("campaigns")
        .doc(campaignId)
        .update({
          amountRaised: FieldValue.increment(amountTotal / 100),
          updatedAt: Timestamp.now(),
        });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const donationId = pi.metadata?.donationId;
    const campaignId = pi.metadata?.campaignId;
    const amount = (pi.amount_received ?? 0) / 100;

    if (donationId) {
      await firestore.collection("donations").doc(donationId).update({
        status: "succeeded",
        amount,
        updatedAt: Timestamp.now(),
      });
    }

    if (campaignId && amount > 0) {
      await firestore
        .collection("campaigns")
        .doc(campaignId)
        .update({
          amountRaised: FieldValue.increment(amount),
          updatedAt: Timestamp.now(),
        });
    }
  }

  return NextResponse.json({ received: true });
}
