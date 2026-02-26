// create a route that takes a stripe account id and deletes it
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function DELETE(req: Request) {
  const { accountId } = await req.json();
  if (!accountId) {
    return NextResponse.json(
      { error: "Account ID is required" },
      { status: 400 },
    );
  }
  try {
    await stripe.accounts.del(accountId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
