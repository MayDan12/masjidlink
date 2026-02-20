"use server";

import { firestore, serverAuth } from "@/firebase/server";
import { sanitizeData } from "@/lib/sanitize";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";
import { getMasjidById } from "../../dashboard/masjids/action";

/** -----------------------------
 *  Helper Functions
 * ----------------------------- */

// Donation Stats
export async function getDonationStats(imamId: string) {
  try {
    const snapshot = await firestore
      .collection("campaigns")
      .where("imamId", "==", imamId)
      .get();

    let totalDonations = 0;
    let activeCampaigns = 0;
    let completedCampaigns = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalDonations += data.amountRaised || 0;
      if (data.status === "active") activeCampaigns++;
      else if (data.status === "completed") completedCampaigns++;
    });

    return {
      totalDonations,
      activeCampaigns,
      completedCampaigns,
    };
  } catch (error) {
    console.error("Error fetching donation stats:", (error as Error).message);
    throw new Error("Internal Server Error");
  }
}

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

    if (!masjidData.data?.stripeAccountId) {
      throw new Error("Masjid stripe account ID not found.");
    }

    const donationToStore = {
      ...donationData,
      imamId: uid,
      masjidName: masjidData.data?.name,
      createdBy: uid,
      createdAt: timestamp,
      updatedAt: timestamp,
      stripeAccountId: masjidData.data?.stripeAccountId,
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
 * edit an existing donation campaign by ID.
 */
export async function editDonationCampaign(
  campaignId: string,
  data: {
    title?: string;
    description?: string;
    goal_amount?: number;
    startDate?: string;
    endDate?: string;
    category?: string;
    token: string;
  },
) {
  try {
    const { token, ...updateData } = data;
    const uid = await verifyImamToken(token);
    const timestamp = Timestamp.now();
    const campaignRef = firestore.collection("campaigns").doc(campaignId);
    const campaignDoc = await campaignRef.get();
    if (!campaignDoc.exists) {
      throw new Error("Campaign not found.");
    }
    const campaignData = campaignDoc.data();
    if (campaignData?.imamId !== uid) {
      throw new Error("Unauthorized: You can only edit your own campaigns.");
    }
    const updatedData = {
      ...campaignData,
      ...updateData,
      updatedAt: timestamp,
    };
    await campaignRef.update(updatedData);
    return { success: true };
  } catch (error) {
    console.error("Error editing campaign:", (error as Error).message);
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

// Get donations by id
export async function getDonationById(campaignId: string) {
  try {
    if (!campaignId) throw new Error("Campaign ID is required.");
    const campaignRef = firestore.collection("campaigns").doc(campaignId);
    const campaignDoc = await campaignRef.get();
    if (!campaignDoc.exists) {
      throw new Error("Campaign not found.");
    }
    const campaignData = campaignDoc.data();
    // Ensure we only return plain JSON-serializable data (no Firestore Timestamp objects)
    const sanitized = {
      id: campaignDoc.id,
      ...JSON.parse(
        JSON.stringify(campaignData, (_, value) =>
          value?._seconds
            ? new Date(value._seconds * 1000).toISOString()
            : value,
        ),
      ),
    };
    return { success: true, campaign: sanitized };
  } catch (error) {
    console.error("Error fetching campaign:", (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}

// Get all donation campaigns for all Imams.
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

/**
 * Get all donations targeting the current Imam (campaign and direct checkout).
 */
export async function getImamDonations(token: string) {
  try {
    const uid = await verifyImamToken(token);

    const snapshot = await firestore
      .collection("donations")
      .where("imamId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const donations = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...sanitizeData(data),
      };
    });

    return { success: true, donations };
  } catch (error) {
    console.error("Error fetching imam donations:", (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Get all livestream donations targeting the current Imam.
 */
export async function getImamLiveDonations(token: string) {
  try {
    const uid = await verifyImamToken(token);

    const snapshot = await firestore
      .collection("live_donations")
      .where("imamId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const donations = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...sanitizeData(data),
      };
    });

    return { success: true, donations };
  } catch (error) {
    console.error(
      "Error fetching imam live donations:",
      (error as Error).message,
    );
    return { success: false, message: (error as Error).message };
  }
}
