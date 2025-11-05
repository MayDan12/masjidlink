import { NextRequest, NextResponse } from "next/server";
import { firestore, serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";

interface UpdateProfileData {
  name: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  skills?: string;
  occupation?: string;
  languages?: string;
  token: string;
}

interface UpdateProfileResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<UpdateProfileResponse>> {
  try {
    const { token, ...profileData }: UpdateProfileData = await request.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const verifiedToken = await serverAuth.verifyIdToken(token);
    const userRole = await checkUserRole(verifiedToken.uid);

    // Check if this is a mobile request
    const userAgent = request.headers.get("user-agent") || "";
    const isMobileApp =
      userAgent.includes("ReactNative") ||
      userAgent.includes("Expo") ||
      request.headers.get("x-mobile-app") === "true";

    if (!isMobileApp) {
      return NextResponse.json(
        { error: "This endpoint is for mobile app only" },
        { status: 403 }
      );
    }

    if (userRole !== "user" && userRole !== "imam") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const uid = verifiedToken.uid;
    const userDocRef = firestore.collection("users").doc(uid);

    // Update with mobile-specific metadata
    await userDocRef.update({
      ...profileData,
      lastUpdatedFrom: "mobile",
      updatedAt: Timestamp.now(),
    });

    // Update Firebase Auth - this only affects the specific user
    await serverAuth.updateUser(uid, {
      displayName: profileData.name,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update failed:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
