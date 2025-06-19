import { serverAuth } from "@/firebase/server";
import { StreamClient } from "@stream-io/node-sdk";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_SECRET_KEY!;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const idToken = authHeader?.replace("Bearer ", "");

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing Firebase token" },
        { status: 401 }
      );
    }

    const decoded = await serverAuth.verifyIdToken(idToken);
    const userId = decoded.uid;

    const client = new StreamClient(apiKey, apiSecret);
    const token = client.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60,
      iat: Math.floor(Date.now() / 1000) - 60,
    });

    return NextResponse.json({ token, userId });
  } catch (error) {
    console.error("Stream token error", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
