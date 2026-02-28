// import Stripe from "stripe";
// import { serverAuth } from "@/firebase/server";
// import { checkUserRole } from "@/utils/server/auth";
// import { firestore } from "@/firebase/server";
// import { Timestamp } from "firebase-admin/firestore";
// import { NextRequest, NextResponse } from "next/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// async function verifyUserToken(token: string) {
//   const decoded = await serverAuth.verifyIdToken(token);
//   const role = await checkUserRole(decoded.uid);
//   if (role !== "user")
//     throw new Error("Unauthorized: Only users can access this resource.");
//   return decoded.uid;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const authHeader = request.headers.get("Authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { success: false, error: "Missing or invalid authorization header" },
//         { status: 401 },
//       );
//     }

//     const token = authHeader.substring(7);
//     const userId = await verifyUserToken(token);

//     const body = await request.json();
//     const { campaignId, amount } = body;

//     if (!campaignId || typeof campaignId !== "string") {
//       return NextResponse.json(
//         { success: false, error: "Invalid campaign ID" },
//         { status: 400 },
//       );
//     }
//     if (!amount || typeof amount !== "number" || amount <= 0) {
//       return NextResponse.json(
//         { success: false, error: "Invalid donation amount" },
//         { status: 400 },
//       );
//     }

//     const campaignDoc = await firestore
//       .collection("campaigns")
//       .doc(campaignId)
//       .get();
//     if (!campaignDoc.exists) {
//       return NextResponse.json(
//         { success: false, error: "Campaign not found" },
//         { status: 404 },
//       );
//     }
//     const campaign = campaignDoc.data();
//     if (!campaign) {
//       return NextResponse.json(
//         { success: false, error: "Campaign data not found" },
//         { status: 404 },
//       );
//     }
//     if (!campaign.stripeAccountId) {
//       return NextResponse.json(
//         { success: false, error: "Stripe account ID not found" },
//         { status: 400 },
//       );
//     }
//     if (campaign.status !== "active") {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "This campaign is not currently accepting donations",
//         },
//         { status: 400 },
//       );
//     }

//     const donationRef = await firestore.collection("donations").add({
//       campaignId,
//       userId,
//       imamId: campaign.imamId,
//       amount,
//       status: "pending",
//       createdAt: Timestamp.now(),
//       updatedAt: Timestamp.now(),
//     });

//     const amountInCents = Math.round(amount * 100);
//     console.log("Checkout request", {
//       campaignId,
//       amount,
//       amountInCents,
//       userId,
//     });
//     // const successUrl = `masjidlink://stripe-redirect?status=success&donationId=${donationRef.id}`;
//     // const cancelUrl = `masjidlink://stripe-redirect?status=cancel&donationId=${donationRef.id}`;
//     const successUrl = `${process.env.NEXT_PUBLIC_API_URL}/donate/${campaignId}?status=success&donationId=${donationRef.id}`;
//     const cancelUrl = `${process.env.NEXT_PUBLIC_API_URL}/donate/${campaignId}?status=cancel&donationId=${donationRef.id}`;
//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       success_url: successUrl,
//       cancel_url: cancelUrl,
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             unit_amount: amountInCents,
//             product_data: { name: `Donation to ${campaign.title}` },
//           },
//           quantity: 1,
//         },
//       ],
//       payment_intent_data: {
//         metadata: {
//           campaignId,
//           userId,
//           imamId: campaign.imamId,
//           type: "campaign",
//           donationId: donationRef.id,
//           source: "checkout",
//         },
//       },

//       metadata: {
//         campaignId,
//         userId,
//         imamId: campaign.imamId,
//         type: "campaign",
//         donationId: donationRef.id,
//       },
//     });

//     await donationRef.update({
//       checkoutSessionId: session.id,
//       updatedAt: Timestamp.now(),
//     });

//     return NextResponse.json({
//       success: true,
//       url: session.url,
//       sessionId: session.id,
//       donationId: donationRef.id,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error
//             ? error.message
//             : "Failed to create checkout session",
//       },
//       { status: 500 },
//     );
//   }
// }

// import Stripe from "stripe";
// import { serverAuth } from "@/firebase/server";
// import { checkUserRole } from "@/utils/server/auth";
// import { firestore } from "@/firebase/server";
// import { Timestamp } from "firebase-admin/firestore";
// import { NextRequest, NextResponse } from "next/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// const PLATFORM_COMMISSION_PERCENT = 10; // 10% platform fee

// async function verifyUserToken(token: string) {
//   const decoded = await serverAuth.verifyIdToken(token);
//   const role = await checkUserRole(decoded.uid);
//   if (role !== "user")
//     throw new Error("Unauthorized: Only users can access this resource.");
//   return decoded.uid;
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Validate environment
//     if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_API_URL) {
//       throw new Error("Missing required environment variables");
//     }

//     // Auth check
//     const authHeader = request.headers.get("Authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { success: false, error: "Missing or invalid authorization header" },
//         { status: 401 },
//       );
//     }

//     const token = authHeader.substring(7);
//     const userId = await verifyUserToken(token);

//     // Validate request body
//     const body = await request.json();
//     const { campaignId, amount } = body;

//     if (!campaignId || typeof campaignId !== "string") {
//       return NextResponse.json(
//         { success: false, error: "Invalid campaign ID" },
//         { status: 400 },
//       );
//     }
//     if (
//       !amount ||
//       typeof amount !== "number" ||
//       amount <= 0 ||
//       amount > 1000000
//     ) {
//       return NextResponse.json(
//         { success: false, error: "Invalid donation amount (max $10,000)" },
//         { status: 400 },
//       );
//     }

//     // Get campaign data
//     const campaignDoc = await firestore
//       .collection("campaigns")
//       .doc(campaignId)
//       .get();

//     if (!campaignDoc.exists) {
//       return NextResponse.json(
//         { success: false, error: "Campaign not found" },
//         { status: 404 },
//       );
//     }

//     const campaign = campaignDoc.data();
//     if (!campaign) {
//       return NextResponse.json(
//         { success: false, error: "Campaign data not found" },
//         { status: 404 },
//       );
//     }

//     if (!campaign.stripeAccountId) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Campaign owner hasn't set up payment receiving",
//         },
//         { status: 400 },
//       );
//     }

//     if (campaign.status !== "active") {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "This campaign is not currently accepting donations",
//         },
//         { status: 400 },
//       );
//     }

//     // Calculate amounts
//     const amountInCents = Math.round(amount * 100);
//     const platformFeeInCents = Math.round(
//       amountInCents * (PLATFORM_COMMISSION_PERCENT / 100),
//     );
//     const campaignAmountInCents = amountInCents - platformFeeInCents;

//     console.log("Checkout request", {
//       campaignId,
//       amount,
//       amountInCents,
//       platformFee: platformFeeInCents,
//       campaignReceives: campaignAmountInCents,
//       userId,
//     });

//     // Create donation record in transaction
//     const donationRef = await firestore.runTransaction(async (transaction) => {
//       const donationRef = firestore.collection("donations").doc();

//       transaction.set(donationRef, {
//         campaignId,
//         userId,
//         imamId: campaign.imamId,
//         amount,
//         platformFee: platformFeeInCents / 100, // Store in dollars for readability
//         campaignAmount: campaignAmountInCents / 100,
//         status: "pending",
//         createdAt: Timestamp.now(),
//         updatedAt: Timestamp.now(),
//       });

//       return donationRef;
//     });

//     // Create Stripe Checkout Session with direct transfer
//     const successUrl = `${process.env.NEXT_PUBLIC_API_URL}/imam/donations/${campaignId}?status=success&donationId=${donationRef.id}`;
//     const cancelUrl = `${process.env.NEXT_PUBLIC_API_URL}/imam/donations/${campaignId}?status=cancel&donationId=${donationRef.id}`;

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       success_url: successUrl,
//       cancel_url: cancelUrl,
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             unit_amount: amountInCents,
//             product_data: {
//               name: `Donation to ${campaign.title}`,
//               description: `Includes ${PLATFORM_COMMISSION_PERCENT}% platform fee`,
//             },
//           },
//           quantity: 1,
//         },
//       ],
//       payment_intent_data: {
//         // Transfer to campaign owner after payment succeeds
//         transfer_data: {
//           destination: campaign.stripeAccountId,
//           amount: campaignAmountInCents, // Amount after platform fee
//         },
//         metadata: {
//           campaignId,
//           userId,
//           imamId: campaign.imamId,
//           type: "campaign",
//           donationId: donationRef.id,
//           source: "checkout",
//           platformFee: platformFeeInCents.toString(),
//           campaignAmount: campaignAmountInCents.toString(),
//         },
//       },
//       metadata: {
//         campaignId,
//         userId,
//         imamId: campaign.imamId,
//         type: "campaign",
//         donationId: donationRef.id,
//         platformFee: platformFeeInCents.toString(),
//         campaignAmount: campaignAmountInCents.toString(),
//       },
//     });

//     // Update donation with session ID
//     await donationRef.update({
//       checkoutSessionId: session.id,
//       updatedAt: Timestamp.now(),
//     });

//     return NextResponse.json({
//       success: true,
//       url: session.url,
//       sessionId: session.id,
//       donationId: donationRef.id,
//       amount: amount,
//       platformFee: platformFeeInCents / 100,
//       campaignReceives: campaignAmountInCents / 100,
//     });
//   } catch (error) {
//     console.error("Checkout session creation failed:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error
//             ? error.message
//             : "Failed to create checkout session",
//       },
//       { status: 500 },
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
const PLATFORM_COMMISSION_PERCENT = 3; // 10% platform fee added to donation

async function verifyUserToken(token: string) {
  const decoded = await serverAuth.verifyIdToken(token);
  const role = await checkUserRole(decoded.uid);
  if (role !== "user")
    throw new Error("Unauthorized: Only users can access this resource.");
  return decoded.uid;
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment
    if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("Missing required environment variables");
    }

    // Auth check
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const userId = await verifyUserToken(token);

    // Validate request body
    const body = await request.json();
    const { campaignId, amount } = body;

    if (!campaignId || typeof campaignId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid campaign ID" },
        { status: 400 },
      );
    }
    if (
      !amount ||
      typeof amount !== "number" ||
      amount <= 0 ||
      amount > 1000000
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid donation amount (max $10,000)" },
        { status: 400 },
      );
    }

    // Get campaign data
    const campaignDoc = await firestore
      .collection("campaigns")
      .doc(campaignId)
      .get();

    if (!campaignDoc.exists) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 },
      );
    }

    const campaign = campaignDoc.data();
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign data not found" },
        { status: 404 },
      );
    }

    if (!campaign.stripeAccountId) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign owner hasn't set up payment receiving",
        },
        { status: 400 },
      );
    }

    if (campaign.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: "This campaign is not currently accepting donations",
        },
        { status: 400 },
      );
    }

    // Calculate amounts - NOW USER PAYS THE FEE ON TOP
    const donationAmountInCents = Math.round(amount * 100); // What campaign receives
    const platformFeeInCents = Math.round(
      donationAmountInCents * (PLATFORM_COMMISSION_PERCENT / 100),
    );
    const totalChargeInCents = donationAmountInCents + platformFeeInCents; // What user pays

    console.log("Checkout request", {
      campaignId,
      donationAmount: amount,
      platformFee: platformFeeInCents / 100,
      totalCharge: totalChargeInCents / 100,
      userId,
    });

    // Create donation record in transaction
    const donationRef = await firestore.runTransaction(async (transaction) => {
      const donationRef = firestore.collection("donations").doc();

      transaction.set(donationRef, {
        campaignId,
        userId,
        imamId: campaign.imamId,
        amount: amount, // Original donation amount
        platformFee: platformFeeInCents / 100,
        totalCharged: totalChargeInCents / 100,
        status: "pending",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return donationRef;
    });

    // Create Stripe Checkout Session with application fee
    const successUrl = `${process.env.NEXT_PUBLIC_API_URL}/donate/${campaignId}?status=success&donationId=${donationRef.id}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_API_URL}/donate/${campaignId}?status=cancel&donationId=${donationRef.id}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: donationAmountInCents,
            product_data: {
              name: `Donation to ${campaign.title}`,
              description: `Includes ${PLATFORM_COMMISSION_PERCENT}% platform fee`,
            },
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            unit_amount: platformFeeInCents,
            product_data: {
              name: `Platform Fee (${PLATFORM_COMMISSION_PERCENT}%)`,
              description: "Supports our platform operations",
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        // Transfer FULL donation to campaign owner
        transfer_data: {
          destination: campaign.stripeAccountId,
          amount: donationAmountInCents, // Full donation amount goes to campaign
        },
        // Application fee goes to platform (alternative to separate line item)
        // application_fee_amount: platformFeeInCents,
        metadata: {
          campaignId,
          userId,
          imamId: campaign.imamId,
          type: "campaign",
          donationId: donationRef.id,
          source: "checkout",
          donationAmount: donationAmountInCents.toString(),
          platformFee: platformFeeInCents.toString(),
        },
      },
      metadata: {
        campaignId,
        userId,
        imamId: campaign.imamId,
        type: "campaign",
        donationId: donationRef.id,
        donationAmount: donationAmountInCents.toString(),
        platformFee: platformFeeInCents.toString(),
      },
    });

    // Update donation with session ID
    await donationRef.update({
      checkoutSessionId: session.id,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      donationId: donationRef.id,
      donationAmount: amount,
      platformFee: platformFeeInCents / 100,
      totalCharge: totalChargeInCents / 100,
    });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      },
      { status: 500 },
    );
  }
}
