// "use server";

// import Stripe from "stripe";
// import { serverAuth } from "@/firebase/server";
// import { checkUserRole } from "@/utils/server/auth";
// import { firestore } from "@/firebase/server";
// import { Timestamp } from "firebase-admin/firestore";
// import { NextRequest, NextResponse } from "next/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// async function verifyUserToken(token: string) {
//   try {
//     const decoded = await serverAuth.verifyIdToken(token);
//     const role = await checkUserRole(decoded.uid);

//     if (role !== "user") {
//       throw new Error("Unauthorized: Only users can access this resource.");
//     }

//     return decoded.uid;
//   } catch (err) {
//     console.error("Auth error:", err);
//     throw new Error("Invalid or expired token.");
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Extract token from Authorization header
//     const authHeader = request.headers.get("Authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { success: false, error: "Missing or invalid authorization header" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.substring(7);

//     // Verify user token
//     const userId = await verifyUserToken(token);
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: "Invalid user token" },
//         { status: 401 }
//       );
//     }

//     // Parse request body
//     const body = await request.json();
//     const { campaignId, amount } = body;

//     // Validate input
//     if (!campaignId || typeof campaignId !== "string") {
//       return NextResponse.json(
//         { success: false, error: "Invalid campaign ID" },
//         { status: 400 }
//       );
//     }

//     if (!amount || typeof amount !== "number" || amount <= 0) {
//       return NextResponse.json(
//         { success: false, error: "Invalid donation amount" },
//         { status: 400 }
//       );
//     }

//     // Verify campaign exists and is active
//     const campaignDoc = await firestore
//       .collection("campaigns")
//       .doc(campaignId)
//       .get();

//     if (!campaignDoc.exists) {
//       return NextResponse.json(
//         { success: false, error: "Campaign not found" },
//         { status: 404 }
//       );
//     }

//     const campaign = campaignDoc.data();
//     if (!campaign) {
//       return NextResponse.json(
//         { success: false, error: "Campaign data not found" },
//         { status: 404 }
//       );
//     }

//     if (campaign.status !== "active") {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "This campaign is not currently accepting donations",
//         },
//         { status: 400 }
//       );
//     }

//     // Create Stripe Payment Intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // dollars → cents
//       currency: "usd",
//       metadata: {
//         campaignId,
//         userId,
//         imamId: campaign.imamId,
//         type: "campaign",
//       },
//       description: `Donation to ${campaign.title}`,
//     });

//     // Create pending donation record
//     const donationRef = await firestore.collection("donations").add({
//       campaignId,
//       userId,
//       imamId: campaign.imamId,
//       amount,
//       status: "pending",
//       paymentIntentId: paymentIntent.id,
//       createdAt: Timestamp.now(),
//       updatedAt: Timestamp.now(),
//     });

//     return NextResponse.json({
//       success: true,
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id,
//       donationId: donationRef.id,
//     });
//   } catch (error) {
//     console.error("Error creating donation checkout:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error
//             ? error.message
//             : "Failed to create checkout session",
//       },
//       { status: 500 }
//     );
//   }
// }
import Stripe from "stripe";
import { serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import { firestore } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function verifyUserToken(token: string) {
  const decoded = await serverAuth.verifyIdToken(token);
  const role = await checkUserRole(decoded.uid);
  if (role !== "user")
    throw new Error("Unauthorized: Only users can access this resource.");
  return decoded.uid;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const userId = await verifyUserToken(token);

    const body = await request.json();
    const { campaignId, amount } = body;

    if (!campaignId || typeof campaignId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid campaign ID" },
        { status: 400 }
      );
    }
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    const campaignDoc = await firestore
      .collection("campaigns")
      .doc(campaignId)
      .get();
    if (!campaignDoc.exists) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }
    const campaign = campaignDoc.data();
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign data not found" },
        { status: 404 }
      );
    }
    if (campaign.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: "This campaign is not currently accepting donations",
        },
        { status: 400 }
      );
    }

    const donationRef = await firestore.collection("donations").add({
      campaignId,
      userId,
      imamId: campaign.imamId,
      amount,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const amountInCents = Math.round(amount * 100);
    const successUrl = `masjidlink://stripe-redirect?status=success&donationId=${donationRef.id}`;
    const cancelUrl = `masjidlink://stripe-redirect?status=cancel&donationId=${donationRef.id}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amountInCents,
            product_data: { name: `Donation to ${campaign.title}` },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          campaignId,
          userId,
          imamId: campaign.imamId,
          type: "campaign",
          donationId: donationRef.id,
        },
      },
      metadata: {
        campaignId,
        userId,
        imamId: campaign.imamId,
        type: "campaign",
        donationId: donationRef.id,
      },
    });

    await donationRef.update({
      checkoutSessionId: session.id,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      donationId: donationRef.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}
