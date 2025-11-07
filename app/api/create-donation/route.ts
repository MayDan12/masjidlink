// import { serverAuth } from "@/firebase/server";
// import { checkUserRole } from "@/utils/server/auth";
// import { NextApiRequest, NextApiResponse } from "next";
// import Stripe from "stripe";

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

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { imamId, token, amount, message } = req.body;

//   if (!amount || !imamId || !token)
//     return res.status(400).json({ error: "Missing parameters" });

//   try {
//     const userId = await verifyUserToken(token);
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // in cents
//       currency: "usd",
//       metadata: { imamId, userId, message },
//     });

//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (err: any) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// }
import { serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    const body = await req.json();
    const { imamId, token, amount, message } = body;

    if (!imamId || !token || !amount) {
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: "Server misconfigured: Stripe key missing" },
        { status: 500 }
      );
    }

    const userId = await verifyUserToken(token);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: { imamId, userId, message },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("API Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
