"use server";
import Stripe from "stripe";
import { serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function verifyUserToken(token: string) {
  try {
    const decoded = await serverAuth.verifyIdToken(token);
    const role = await checkUserRole(decoded.uid);

    if (role !== "user") {
      throw new Error("Unauthorized: Only users can access this resource.");
    }

    return decoded.uid;
  } catch (err) {
    console.error("Auth error:", err);
    throw new Error("Invalid or expired token.");
  }
}

export async function createDonationIntent(
  callId: string,
  amount: number,
  token: string,
  imamId: string
) {
  try {
    // Verify the user token and get user ID
    const userId = await verifyUserToken(token);
    if (!userId) throw new Error("Invalid user token");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // dollars → cents
      currency: "usd",
      metadata: { callId, userId, imamId },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return { error: (error as Error).message };
  }
}
