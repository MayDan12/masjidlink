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

// dffff;

// export async function POST(req: Request) {
//   try {
//     const token = req.headers.get("authorization")?.split("Bearer ")[1];
//     if (!token) throw new Error("Unauthorized");

//     const decoded = await serverAuth.verifyIdToken(token);
//     const uid = decoded.uid;

//     const data: SignupRequest = await req.json();

//     if (!data.name || !data.termsAccepted) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const userDoc: UserDocument = {
//       uid,
//       email: decoded.email!,
//       name: data.name,
//       role: data.role,
//       donorRank: "Muḥsin",
//       followingMasjids: [],
//       termsAccepted: data.termsAccepted,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     let masjidId: string | undefined;

//     if (data.role === "imam") {
//       if (!data.masjidName || !data.masjidAddress) {
//         throw new Error("Masjid info required");
//       }

//       const masjidRef = firestore.collection("masjids").doc();
//       masjidId = masjidRef.id;

//       const masjidDoc: MasjidDocument = {
//         masjidId,
//         name: data.masjidName,
//         address: data.masjidAddress,
//         imamId: uid,
//         imamName: data.name,
//         imamApproved: false,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       userDoc.masjidId = masjidId;
//       userDoc.role = data.role;
//       userDoc.imamApproved = false;

//       await firestore.runTransaction(async (tx) => {
//         tx.set(masjidRef, masjidDoc);
//         tx.set(firestore.doc(`users/${uid}`), userDoc);
//       });
//     } else {
//       await firestore.doc(`users/${uid}`).set(userDoc);
//     }

//     return NextResponse.json({ success: true, uid, masjidId, role: data.role });
//   } catch (err: any) {
//     console.error("Signup profile error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
