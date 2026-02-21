import { NextResponse } from "next/server";
import { serverAuth, firestore } from "@/firebase/server";
import {
  UserDocument,
  MasjidDocument,
  SignupRequest,
  UserRole,
} from "@/types/auth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const signupData: SignupRequest = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      role: formData.get("role") as UserRole,
      masjidName: formData.get("masjidName") as string,
      masjidAddress: formData.get("masjidAddress") as string,
      termsAccepted: formData.get("termsAccepted") === "true",
      masjidProfileImage: formData.get("masjidProfileImage") as string,
    };

    // Validate input
    if (!signupData) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 },
      );
    }

    // Create user in Firebase Auth
    const userRecord = await serverAuth.createUser({
      email: signupData.email,
      password: signupData.password,
      displayName: signupData.name,
    });

    // Prepare user document
    const userDoc: UserDocument = {
      uid: userRecord.uid,
      email: signupData.email,
      name: signupData.name,
      role: signupData.role,
      donorRank: "Muḥsin",
      followingMasjids: [],
      termsAccepted: signupData.termsAccepted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let masjidId: string | undefined;

    // Handle imam registration
    if (signupData.role === "imam") {
      if (!signupData.masjidName || !signupData.masjidAddress) {
        throw new Error("Masjid name and address are required for imams");
      }

      masjidId = userRecord.uid; // Using user ID as masjid ID for simplicity

      const masjidDoc: MasjidDocument = {
        masjidId,
        name: signupData.masjidName,
        address: signupData.masjidAddress,
        masjidProfileImage: signupData.masjidProfileImage,
        imamId: userRecord.uid,
        imamName: signupData.name,
        imamApproved: false,
        stripeAccountId: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create masjid document
      await firestore.collection("masjids").doc(masjidId).set(masjidDoc);

      // Update user document with masjid reference
      userDoc.masjidId = masjidId;
      userDoc.imamApproved = false;
    }

    // Create user document
    await firestore.collection("users").doc(userRecord.uid).set(userDoc);

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      email: signupData.email,
      name: signupData.name,
      role: signupData.role,
      ...(signupData.role === "imam" && { masjidId, imamApproved: false }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
