"use server";

import Stripe from "stripe";
import { serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import { firestore } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

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

export async function createCampaignDonationIntent(
  campaignId: string,
  amount: number,
  token: string
) {
  try {
    // Verify the user token and get user ID
    const userId = await verifyUserToken(token);
    if (!userId) throw new Error("Invalid user token");

    // Verify campaign exists and is active
    const campaignDoc = await firestore
      .collection("campaigns")
      .doc(campaignId)
      .get();
    if (!campaignDoc.exists) {
      throw new Error("Campaign not found");
    }

    const campaign = campaignDoc.data();
    if (!campaign) {
      throw new Error("Campaign data not found");
    }

    if (campaign.status !== "active") {
      throw new Error("This campaign is not currently accepting donations");
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // dollars → cents
      currency: "usd",
      metadata: {
        campaignId,
        userId,
        imamId: campaign.imamId,
        type: "campaign",
      },
      description: `Donation to ${campaign.title}`,
    });

    // Create pending donation record
    await firestore.collection("donations").add({
      campaignId,
      userId,
      imamId: campaign.imamId,
      amount,
      status: "pending",
      paymentIntentId: paymentIntent.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function confirmCampaignDonation(
  paymentIntentId: string,
  token: string
) {
  try {
    const userId = await verifyUserToken(token);

    // Verify payment intent was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment not completed");
    }

    // Update donation status
    const donationsSnapshot = await firestore
      .collection("donations")
      .where("paymentIntentId", "==", paymentIntentId)
      .where("userId", "==", userId)
      .get();

    if (donationsSnapshot.empty) {
      throw new Error("Donation record not found");
    }

    const donationDoc = donationsSnapshot.docs[0];
    const donationData = donationDoc.data();

    // Update donation status
    await donationDoc.ref.update({
      status: "completed",
      updatedAt: Timestamp.now(),
    });

    // Update campaign amount raised
    const campaignRef = firestore
      .collection("campaigns")
      .doc(donationData.campaignId);
    const campaignDoc = await campaignRef.get();
    const campaignData = campaignDoc.data();

    if (!campaignData) {
    }

    const newAmountRaised =
      (campaignData.amountRaised || 0) + donationData.amount;

    await campaignRef.update({
      amountRaised: newAmountRaised,
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
      donationId: donationDoc.id,
      amount: donationData.amount,
    };
  } catch (error) {
    console.error("Error confirming donation:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
