// import { serverAuth } from "@/firebase/server";
// import { checkUserRole } from "@/utils/server/auth";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// async function verifyUserToken(token: string) {
//   const decoded = await serverAuth.verifyIdToken(token);
//   const role = await checkUserRole(decoded.uid);

//   if (role !== "user") {
//     throw new Error("Unauthorized: Only users can access this resource.");
//   }

//   return decoded.uid;
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { imamId, token, amount, message } = body;

//     if (!imamId || !token || !amount) {
//       return Response.json({ error: "Missing parameters" }, { status: 400 });
//     }

//     if (!process.env.STRIPE_SECRET_KEY) {
//       return Response.json(
//         { error: "Server misconfigured: Stripe key missing" },
//         { status: 500 },
//       );
//     }

//     const userId = await verifyUserToken(token);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100),
//       currency: "usd",
//       metadata: { imamId, userId, message },
//     });

//     return Response.json({ clientSecret: paymentIntent.client_secret });
//   } catch (err: any) {
//     console.error("API Error:", err);
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

import { serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import { firestore } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const PLATFORM_COMMISSION_PERCENT = 10; // 10% platform fee added to user's payment

async function verifyUserToken(token: string) {
  const decoded = await serverAuth.verifyIdToken(token);
  const role = await checkUserRole(decoded.uid);

  if (role !== "user") {
    throw new Error("Unauthorized: Only users can access this resource.");
  }

  return decoded.uid;
}

export async function POST(req: Request) {
  try {
    // Validate environment
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: "Server misconfigured: Stripe key missing" },
        { status: 500 },
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { imamId, token, amount, message } = body;

    if (!imamId || !token || !amount) {
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0 || amount > 1000000) {
      return Response.json(
        { error: "Invalid amount (must be between $1 and $10,000)" },
        { status: 400 },
      );
    }

    // Verify user authentication
    const userId = await verifyUserToken(token);

    // Get imam's data from Firestore
    const imamDoc = await firestore.collection("masjids").doc(imamId).get();

    if (!imamDoc.exists) {
      return Response.json({ error: "Imam not found" }, { status: 404 });
    }

    const imamData = imamDoc.data();

    if (!imamData?.stripeAccountId) {
      return Response.json(
        {
          error:
            "Imam hasn't set up payment receiving. Please ask them to complete Stripe onboarding.",
        },
        { status: 400 },
      );
    }

    // Check if imam's Stripe account is fully onboarded
    try {
      const account = await stripe.accounts.retrieve(imamData.stripeAccountId);
      if (!account.charges_enabled) {
        return Response.json(
          {
            error:
              "Imam's payment account is not fully set up. Please ask them to complete onboarding.",
          },
          { status: 400 },
        );
      }
    } catch (stripeError) {
      console.error("Error retrieving Stripe account:", stripeError);
      return Response.json(
        { error: "Invalid Stripe account configuration" },
        { status: 400 },
      );
    }

    // Calculate amounts - USER PAYS THE FEE ON TOP
    const imamAmountInCents = Math.round(amount * 100); // Full amount goes to imam
    const platformFeeInCents = Math.round(
      imamAmountInCents * (PLATFORM_COMMISSION_PERCENT / 100),
    );
    const totalChargeInCents = imamAmountInCents + platformFeeInCents; // What user pays

    console.log("Payment intent request", {
      imamId,
      userId,
      donationAmount: amount,
      platformFee: platformFeeInCents / 100,
      totalCharge: totalChargeInCents / 100,
    });

    // Create a payment record in Firestore (for tracking)
    const paymentRef = await firestore.collection("payments").add({
      imamId,
      userId,
      amount: amount, // Original donation amount
      platformFee: platformFeeInCents / 100,
      totalCharged: totalChargeInCents / 100,
      message: message || "",
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Create Payment Intent with TWO options:

    // OPTION 1: Two line items approach (more transparent)
    // For Payment Intents, we need to use a different approach since we can't have line items
    // We'll create a single payment intent and handle the fee in metadata

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalChargeInCents, // Charge user the total including fee
      currency: "usd",

      // Transfer FULL donation amount to imam's connected account
      transfer_data: {
        destination: imamData.stripeAccountId,
        amount: imamAmountInCents, // Full donation amount goes to imam
      },

      metadata: {
        imamId,
        userId,
        type: "direct_payment",
        paymentId: paymentRef.id,
        message: message?.substring(0, 100) || "",
        donationAmount: imamAmountInCents.toString(),
        platformFee: platformFeeInCents.toString(),
      },

      // Optional: Add statement descriptor
      statement_descriptor: "DONATION TO IMAM",
      statement_descriptor_suffix: imamData.name?.substring(0, 12) || "IMAM",
    });

    // Update payment record with Stripe info
    await paymentRef.update({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      updatedAt: Timestamp.now(),
    });

    // Return detailed response including fee breakdown
    return Response.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentRef.id,
      donationAmount: amount,
      platformFee: platformFeeInCents / 100,
      totalCharge: totalChargeInCents / 100,
      message: message || "",
    });
  } catch (err: any) {
    console.error("API Error:", err);

    // Handle specific Stripe errors
    if (err.type === "StripeInvalidRequestError") {
      return Response.json(
        { error: `Stripe error: ${err.message}` },
        { status: 400 },
      );
    }

    return Response.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
