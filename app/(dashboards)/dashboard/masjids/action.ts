"use server";

import { FieldValue } from "firebase-admin/firestore";
import { firestore, serverAuth } from "@/firebase/server";
import { sanitizeData } from "@/lib/sanitize";

export const getAllMasjids = async () => {
  try {
    const masjidsSnapshot = await firestore.collection("masjids").get();
    const masjids = masjidsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeData(doc.data()),
    }));

    return {
      success: true,
      data: masjids,
    };
  } catch (error) {
    return {
      error: true,
      message: (error as Error).message || "Failed to fetch masjids.",
    };
  }
};

export const getMasjidById = async (masjidId: string) => {
  try {
    const masjidDoc = await firestore.collection("masjids").doc(masjidId).get();
    if (!masjidDoc.exists) {
      return {
        error: true,
        message: "Masjid not found.",
      };
    }
    const masjidData = sanitizeData(masjidDoc.data());
    return {
      success: true,
      data: masjidData,
    };
  } catch (error) {
    return {
      error: true,
      message: (error as Error).message || "Failed to fetch masjid.",
    };
  }
};

// This function allows a user to join a masjid by adding their user ID to the masjid's followers collection.
// export const joinMasjid = async (data: { token: string; masjidId: string }) => {
//   const { token, masjidId } = data;
//   let displayName = "";
//   let email = "";
//   let photoURL = "";

//   try {
//     const verifiedToken = await serverAuth.verifyIdToken(token);
//     const userId = verifiedToken.uid;

//     // Optionally: fetch more user info from another users collection if needed
//     const userDoc = await firestore.collection("users").doc(userId).get();
//     if (userDoc.exists) {
//       const userData = userDoc.data();
//       displayName = userData?.displayName || "";
//       email = userData?.email || "";
//       photoURL = userData?.photoURL || "";
//     }

//     const userRef = firestore.collection("users").doc(userId);

//     const followerRef = firestore
//       .collection("masjids")
//       .doc(masjidId)
//       .collection("followers")
//       .doc(userId);

//     const followerDoc = await followerRef.get();

//     if (followerDoc.exists) {
//       return {
//         success: true,
//         message: "You have already joined this masjid.",
//       };
//     }

//     await firestore
//       .collection("masjids")
//       .doc(masjidId)
//       .collection("followers")
//       .doc(userId)
//       .set({
//         userId,
//         joinedAt: new Date().toISOString(),
//         displayName,
//         email,
//         photoURL, // optionally include displayName, email, etc.
//       });

//     await userRef.update();

//     return {
//       success: true,
//       message: "Successfully joined masjid.",
//     };
//   } catch (error) {
//     return {
//       error: true,
//       message: (error as Error).message || "Failed to join masjid.",
//     };
//   }
// };

export const joinMasjid = async (data: { token: string; masjidId: string }) => {
  const { token, masjidId } = data;
  let displayName = "";
  let email = "";
  let photoURL = "";

  try {
    const verifiedToken = await serverAuth.verifyIdToken(token);
    const userId = verifiedToken.uid;

    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      displayName = userData?.displayName || "";
      email = userData?.email || "";
      photoURL = userData?.photoURL || "";
    }

    const masjidRef = firestore.collection("masjids").doc(masjidId);

    const followerRef = firestore
      .collection("masjids")
      .doc(masjidId)
      .collection("followers")
      .doc(userId);

    const followerDoc = await followerRef.get();

    if (followerDoc.exists) {
      return {
        success: true,
        message: "You have already joined this masjid.",
      };
    }

    await masjidRef.set(
      {
        followersCount: FieldValue.increment(1),
      },
      { merge: true }
    );

    // Add user to masjid's followers subcollection
    await followerRef.set({
      userId,
      joinedAt: new Date().toISOString(),
      displayName,
      email,
      photoURL,
    });

    // ✅ Add masjidId to user's "followers" array using arrayUnion
    await userRef.update({
      followers: FieldValue.arrayUnion(masjidId),
    });

    return {
      success: true,
      message: "Successfully joined masjid.",
    };
  } catch (error) {
    console.error("Join masjid error:", error);
    return {
      error: true,
      message: (error as Error).message || "Failed to join masjid.",
    };
  }
};
