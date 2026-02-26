import { NextResponse } from "next/server";
import Stripe from "stripe";
import { firestore } from "@/firebase/server";
import { serverAuth } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.split("Bearer ")[1];
    const decoded = await serverAuth.verifyIdToken(token);
    const imamId = decoded.uid;

    const imamRef = firestore.doc(`masjids/${imamId}`);
    const imamDoc = await imamRef.get();
    const imamData = imamDoc.data();

    let accountId = imamData?.stripeAccountId;

    // ✅ If no account exists, create one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: imamData?.email,
        capabilities: {
          transfers: { requested: true },
        },
        metadata: { imamId },
      });

      accountId = account.id;

      await imamRef.set(
        {
          stripeAccountId: accountId,
          stripeConnected: false,
          updatedAt: new Date(),
        },
        { merge: true },
      );
    }

    // ✅ Always create onboarding link using existing or new accountId
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_API_URL}/connect-stripe`,
      return_url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard?stripe=refresh`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      accountId,
      onboardingUrl: link.url,
    });
  } catch (error: any) {
    console.error("Stripe account error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
