"use server";
import { firestore, serverAuth } from "@/firebase/server";
import { PrayerTime } from "@/types/masjid";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";

export const saveMasjidPrayerTime = async function (data: {
  prayerTimes: PrayerTime[];
  token: string;
}) {
  try {
    const { prayerTimes, token } = data;
    const verifiedToken = await serverAuth.verifyIdToken(token);
    const uid = verifiedToken.uid;

    const userRole = await checkUserRole(uid);
    if (userRole !== "imam") {
      return {
        error: true,
        message: "Unauthorized: Only imams can save prayer times.",
      };
    }

    await firestore.collection("masjids").doc(uid).set(
      {
        prayerTimes,
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message || "Failed to save prayer times.",
      };
    } else {
      return {
        error: true,
        message: "Unknown error occurred while saving prayer times.",
      };
    }
  }
  return {
    success: true,
    message: "Prayer times saved successfully.",
  };
};

export const getMasjidPrayerTimes = async (token: string) => {
  try {
    const verifiedToken = await serverAuth.verifyIdToken(token);
    const uid = verifiedToken.uid;

    const doc = await firestore.collection("masjids").doc(uid).get();

    if (!doc.exists || !doc.data()?.prayerTimes) {
      return { success: true, prayerTimes: null };
    }

    return {
      success: true,
      prayerTimes: doc.data()?.prayerTimes,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message || "Failed to fetch prayer times.",
      };
    } else {
      return {
        error: true,
        message: "Unknown error occurred while fetching prayer times.",
      };
    }
  }
};
