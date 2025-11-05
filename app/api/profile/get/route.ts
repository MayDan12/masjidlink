import { NextRequest, NextResponse } from "next/server";
import { firestore, serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import { sanitizeData } from "@/lib/sanitize";

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  skills?: string;
  occupation?: string;
  languages?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface GetProfileResponse {
  success?: boolean;
  data?: UserProfile;
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetProfileResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const verifiedToken = await serverAuth.verifyIdToken(token);
    const userRole = await checkUserRole(verifiedToken.uid);

    if (userRole !== "user" && userRole !== "imam") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const uid = verifiedToken.uid;
    const userDocRef = firestore.collection("users").doc(uid);
    const doc = await userDocRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const docData = sanitizeData(doc.data()) as UserProfile;

    return NextResponse.json({
      success: true,
      data: docData,
    });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
