"use server";

import { firestore, serverAuth } from "@/firebase/server";
// import { sanitizeData } from "@/lib/sanitize";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";
import { getMasjidById } from "../../dashboard/masjids/action";

/** -----------------------------
 *  Helper Functions
 * ----------------------------- */

async function verifyImamToken(token: string) {
  try {
    const decoded = await serverAuth.verifyIdToken(token);
    const role = await checkUserRole(decoded.uid);

    if (role !== "imam") {
      throw new Error("Unauthorized: Only imams can access this resource.");
    }

    return decoded.uid;
  } catch (err) {
    console.error("Auth error:", err);
    throw new Error("Invalid or expired token.");
  }
}

/** -----------------------------
 *  Server Actions
 * ----------------------------- */

/**
 * Create a new donation campaign.
 */
export async function createDonations(data: {
  title: string;
  description: string;
  goal_amount: number;
  startDate: string;
  endDate: string;
  category: string;
  token: string;
}) {
  try {
    const { token, ...donationData } = data;
    const uid = await verifyImamToken(token);
    const timestamp = Timestamp.now();

    const masjidData = await getMasjidById(uid);
    if (!masjidData) {
      throw new Error("Masjid not found for the given Imam.");
    }

    const donationToStore = {
      ...donationData,
      imamId: uid,
      masjidName: masjidData.data?.name,
      createdBy: uid,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: "active",
      amountRaised: 0,
    };

    const docRef = await firestore.collection("campaigns").add(donationToStore);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating donation:", (error as Error).message);
    return {
      success: false,
      message: (error as Error).message || "Internal Server Error",
    };
  }
}

/**
 * Delete an existing donation campaign by ID.
 */
export async function deleteDonationCampaign(campaignId: string) {
  try {
    if (!campaignId) throw new Error("Campaign ID is required.");

    await firestore.collection("campaigns").doc(campaignId).delete();

    return { success: true };
  } catch (error) {
    console.error("Error deleting campaign:", (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Get all donation campaigns for an Imam.
 */
export async function getDonationCampaigns(token: string) {
  try {
    const uid = await verifyImamToken(token);
    // console.log("Verified UID:", uid);

    const snapshot = await firestore
      .collection("campaigns")
      .where("imamId", "==", uid)
      .get();

    // ✅ Convert Firestore Timestamps to plain ISO strings
    const campaigns = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...JSON.parse(
          JSON.stringify(data, (_, value) =>
            value?._seconds
              ? new Date(value._seconds * 1000).toISOString()
              : value,
          ),
        ),
      };
    });

    return { success: true, campaigns };
  } catch (error) {
    console.error("Error fetching campaigns:", (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}

export async function getDonationsCampaigns() {
  try {
    // console.log("Verified UID:", uid);

    const snapshot = await firestore.collection("campaigns").get();

    // ✅ Convert Firestore Timestamps to plain ISO strings
    const campaigns = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...JSON.parse(
          JSON.stringify(data, (_, value) =>
            value?._seconds
              ? new Date(value._seconds * 1000).toISOString()
              : value,
          ),
        ),
      };
    });

    return { success: true, campaigns };
  } catch (error) {
    console.error("Error fetching campaigns:", (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}
