import { NextResponse } from "next/server";
import Stripe from "stripe";
import { firestore } from "@/firebase/server";
import { serverAuth } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    // ✅ Verify Firebase user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.split("Bearer ")[1];
    const decoded = await serverAuth.verifyIdToken(token);
    const imamId = decoded.uid;

    // ✅ Check if Imam already has Stripe account
    const imamDoc = await firestore.doc(`masjids/${imamId}`).get();
    const imamData = imamDoc.data();

    if (imamData?.stripeAccountId) {
      return NextResponse.json({ accountId: imamData.stripeAccountId });
    }

    // ✅ Create Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: "express",
      capabilities: {
        transfers: { requested: true },
      },
      metadata: { imamId },
    });

    // ✅ Save to Firestore
    await firestore.doc(`masjids/${imamId}`).set(
      {
        stripeAccountId: account.id,
        stripeConnected: false,
        createdAt: new Date(),
      },
      { merge: true },
    );

    // ✅ Create onboarding link
    const link = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/connect-stripe`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      accountId: account.id,
      onboardingUrl: link.url,
    });
  } catch (error: any) {
    console.error("Stripe account error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// Create an api that return's i am fine
