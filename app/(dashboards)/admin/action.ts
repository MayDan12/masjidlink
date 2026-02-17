"use server";
import { firestore } from "@/firebase/server";
import { sanitizeData } from "@/lib/sanitize";
// We want to fetch all users and masjids from the database
export const getUsersAndMasjids = async () => {
  try {
    const usersSnapshot = await firestore.collection("users").get();
    const masjidsSnapshot = await firestore.collection("masjids").get();

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeData(doc.data()),
    }));

    const masjids = masjidsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeData(doc.data()),
    }));

    return {
      success: true,
      data: {
        users,
        masjids,
      },
    };
  } catch (error) {
    return {
      error: true,
      message: (error as Error).message || "Failed to fetch users and masjids.",
    };
  }
};
