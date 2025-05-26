import { NextResponse } from "next/server";
import { firestore, serverAuth, adminStorage } from "@/firebase/server";
import { verifySession } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const session = cookies().get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uid = cookies().get("firebaseUserId")?.value;

    const formData = await request.formData();

    // Extract form data
    const bio = formData.get("bio") as string;
    const imageFile = formData.get("image") as File | null;

    // Validate imam role
    const userDoc = await firestore.collection("users").doc(uid).get();
    if (userDoc.data()?.role !== "imam") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updates: Record<string, any> = {
      bio,
      updatedAt: new Date().toISOString(),
    };

    // Handle image upload if provided
    if (imageFile) {
      const bucket = adminStorage.bucket();
      const fileName = `imam-profiles/${uid}/${Date.now()}-${imageFile.name}`;
      const file = bucket.file(fileName);

      // Convert File to Buffer
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      await file.save(buffer, {
        metadata: {
          contentType: imageFile.type,
        },
      });

      // Make file publicly accessible
      await file.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      updates.profileImage = imageUrl;
    }

    // Update Firestore document
    await firestore.collection("users").doc(uid).update(updates);

    // Update Auth record if display name changed
    if (formData.get("name")) {
      await serverAuth.updateUser(uid, {
        displayName: formData.get("name") as string,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}
