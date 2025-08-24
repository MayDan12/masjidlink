"use server";

import { firestore } from "@/firebase/server";
import { sanitizeData } from "@/lib/sanitize";

export const getEvents = async () => {
  try {
    const eventsSnapshot = await firestore.collection("events").get();
    const events = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeData(doc.data()),
    }));

    return {
      success: true,
      data: events,
    };
  } catch (error) {
    return {
      error: true,
      message: (error as Error).message || "Failed to fetch events.",
    };
  }
};
