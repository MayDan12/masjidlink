import { NextRequest, NextResponse } from "next/server";
import { firestore, serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";

interface UploadImageResponse {
  success?: boolean;
  message?: string;
  imageUrl?: string;
  publicId?: string;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadImageResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const verifiedToken = await serverAuth.verifyIdToken(token);
    const userRole = await checkUserRole(verifiedToken.uid);
    const userId = verifiedToken.uid;

    // Check if this is a mobile request by looking for a header or specific parameter
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

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const blob = new Blob([buffer], { type: file.type });

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", blob, file.name);
    cloudinaryForm.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudinaryForm,
      }
    );

    const result = await uploadResponse.json();

    if (result.error) {
      throw new Error(result.error.message);
    }

    const imageUrl = result.secure_url;

    // Update Firebase Auth photoURL - this is safe as it only affects the specific user
    try {
      await serverAuth.updateUser(userId, {
        photoURL: imageUrl,
      });
    } catch (authError) {
      console.error("Failed to update Firebase Auth photoURL:", authError);
    }

    // Update user profile in Firestore with mobile-specific field
    const userDocRef = firestore.collection("users").doc(userId);
    await userDocRef.update({
      profilePicture: imageUrl,
      lastUpdatedFrom: "mobile",
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      },
      { status: 500 }
    );
  }
}
