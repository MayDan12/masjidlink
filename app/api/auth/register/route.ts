import { NextResponse } from "next/server";
import { serverAuth, firestore } from "@/firebase/server";
import { UserDocument, MasjidDocument, SignupRequest } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      name,
      role,
      masjidName,
      masjidAddress,
      termsAccepted,
    }: SignupRequest = await request.json();

    // Validate input
    if (!email || !password || !name || !termsAccepted) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 },
      );
    }

    // Create user in Firebase Auth
    const userRecord = await serverAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Prepare user document
    const userDoc: UserDocument = {
      uid: userRecord.uid,
      email,
      name,
      role,
      donorRank: "Muḥsin",
      followingMasjids: [],
      termsAccepted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let masjidId: string | undefined;

    // Handle imam registration
    if (role === "imam") {
      if (!masjidName || !masjidAddress) {
        throw new Error("Masjid name and address are required for imams");
      }

      masjidId = userRecord.uid; // Using user ID as masjid ID for simplicity

      const masjidDoc: MasjidDocument = {
        masjidId,
        name: masjidName,
        address: masjidAddress,
        imamId: userRecord.uid,
        imamName: name,
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
      email,
      name,
      role,
      ...(role === "imam" && { masjidId, imamApproved: false }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
