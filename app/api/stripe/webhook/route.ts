import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/firebase/server";

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
    const amountTotal = session.amount_total;
    if (donationId) {
      await firestore
        .collection("donations")
        .doc(donationId)
        .update({
          status: "succeeded",
          amount: (amountTotal ?? 0) / 100,
          updatedAt: new Date(),
        });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const donationId = pi.metadata?.donationId;
    if (donationId) {
      await firestore.collection("donations").doc(donationId).update({
        status: "succeeded",
        updatedAt: new Date(),
      });
    }
  }

  return NextResponse.json({ received: true });
}
