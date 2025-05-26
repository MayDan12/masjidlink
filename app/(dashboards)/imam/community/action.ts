"use server";

import { firestore, serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";

export const getMasjidFollowers = async (token: string) => {
  try {
    const verifiedToken = await serverAuth.verifyIdToken(token);
    const uid = verifiedToken.uid;

    const userRole = await checkUserRole(uid);
    if (userRole !== "imam") {
      return {
        error: true,
        message: "Unauthorized: Only imams can view followers.",
      };
    }

    const followersSnapshot = await firestore
      .collection("masjids")
      .doc(uid)
      .collection("followers")
      .get();

    const followers = followersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      data: followers,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message || "Failed to fetch masjid followers.",
    };
  }
};
