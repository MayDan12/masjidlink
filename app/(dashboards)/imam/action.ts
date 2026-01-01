"use server";
import { firestore, serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";

type PrayerTimes = {
  fajr: { time: string; notification: boolean; bellReminder: boolean };
  dhuhr: { time: string; notification: boolean; bellReminder: boolean };
  asr: { time: string; notification: boolean; bellReminder: boolean };
  maghrib: { time: string; notification: boolean; bellReminder: boolean };
  isha: { time: string; notification: boolean; bellReminder: boolean };
};

export const saveMasjidPrayerTime = async function (data: {
  prayerTimes: PrayerTimes;
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

    await firestore
      .collection("masjids")
      .doc(uid)
      .collection("prayerTimes")
      .doc("current")
      .set({
        ...prayerTimes,
        timestamp: Timestamp.now(),
      });
  } catch (error: any) {
    return {
      error: true,
      message: error.message || "Failed to save prayer times.",
    };
  }
  return {
    success: true,
    message: "Prayer times saved successfully.",
  };
};
