import { firestore, serverAuth } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { checkUserRole } from "@/utils/server/auth";

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
    const {
      imamId,
      token,
      amount,
      message,
      anonymous,
      paymentIntentId,
      status,
    } = body;

    if (!imamId || !token || !amount || !paymentIntentId || !status) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const userId = await verifyUserToken(token);

    const donationData = {
      imamId,
      userId,
      amount,
      status,
      message: message || "",
      anonymous: !!anonymous,
      paymentIntentId,
      createdAt: Timestamp.now(),
    };

    await firestore.collection("live_donations").add(donationData);

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("Error storing donation:", err);
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
