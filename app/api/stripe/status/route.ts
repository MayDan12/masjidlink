import { NextResponse } from "next/server";
import Stripe from "stripe";
import { firestore, serverAuth } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token required." },
        { status: 401 },
      );
    }

    // ✅ Verify Firebase token
    const decodedToken = await serverAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // ✅ Get masjid document
    const masjidDoc = await firestore.collection("masjids").doc(uid).get();

    if (!masjidDoc.exists) {
      return NextResponse.json({ error: "Masjid not found." }, { status: 404 });
    }

    const masjidData = masjidDoc.data();

    // If no Stripe account yet
    if (!masjidData?.stripeAccountId) {
      return NextResponse.json({
        connected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        stripeAccountId: null,
      });
    }

    // ✅ Retrieve Stripe account
    const account = await stripe.accounts.retrieve(masjidData.stripeAccountId);

    return NextResponse.json({
      connected: true,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      stripeAccountId: account.id,
    });
  } catch (error) {
    console.error("Stripe status error:", error);
    return NextResponse.json(
      {
        error: `Failed to retrieve Stripe status. ${(error as Error).message}`,
      },
      { status: 500 },
    );
  }
}
