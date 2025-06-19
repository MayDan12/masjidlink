"use server";

import { firestore, serverAuth, messaging } from "@/firebase/server";
// import { firestore, serverAuth, messaging } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";

export const createAnnouncements = async (data: {
  title: string;
  content: string;
  isEmergency?: boolean;
  type: string;
  severity?: "low" | "medium" | "high" | "critical";
  token: string;
}) => {
  const { token, ...announcementData } = data;

  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can create announcements.",
    };
  }

  const uid = verifiedToken.uid;
  const timestamp = Timestamp.now();

  const announcementToStore = {
    ...announcementData,
    createdBy: uid,
    createdAt: timestamp,
    updatedAt: timestamp,
    rsvps: [], // 👈 Initialize RSVP list
  };

  // Use auto-generated ID for each new event
  const announcementRef = firestore.collection("announcements").doc(); // 👈 New doc ID
  await announcementRef.set(announcementToStore);

  // try {
  //   const masjidFollowers = await firestore.collection("users").get();

  //   const tokens = masjidFollowers.docs
  //     .map((doc) => doc.data().fcmToken)
  //     .filter((token) => token);

  //   if (tokens.length > 0) {
  //     await messaging.sendEachForMulticast({
  //       tokens,
  //       notification: {
  //         title: `[URGENT] ${announcementData.title}`,
  //         body: announcementData.content,
  //       },
  //     });
  //   }
  // } catch (error) {
  //   console.error("Error sending notifications:", error);
  // }

  return {
    success: true,
    message: "Announcements successfully created.",
    announcementId: announcementRef.id,
  };
};

// export const getAnnouncementsByUserId = async (data: { token: string }) => {
//   try {
//     const { token } = data;

//     const verifiedToken = await serverAuth.verifyIdToken(token);
//     const userRole = await checkUserRole(verifiedToken.uid);
//     const userId = verifiedToken.uid;

//     if (userRole !== "imam") {
//       return {
//         error: true,
//         message: "Unauthorized: Only imams can view events.",
//       };
//     }

//     const announcementRef = firestore.collection("announcements");
//     const snapshot = await announcementRef
//       .where("createdBy", "==", userId)
//       .get();

//     const announcements = snapshot.docs.map((doc) => {
//       const data = doc.data();

//       // Convert Firestore Timestamps to ISO strings

//       const convertedData: Record<string, any> = {};
//       for (const [key, value] of Object.entries(data)) {
//         if (value?.toDate) {
//           // Check if it's a Firestore Timestamp
//           convertedData[key] = value.toDate().toISOString();
//         } else {
//           convertedData[key] = value;
//         }
//       }

//       return {
//         id: doc.id,
//         ...convertedData,
//       };
//     });

//     return {
//       success: true,
//       announcements,
//     };
//   } catch (error) {
//     console.error("Error fetching announcements:", error);
//     return {
//       error: true,
//       message: "An unexpected error occurred while fetching announcements.",
//     };
//   }
// };

// Define the EmergencyAlert type

// Define types for better type safety
interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  expiryDate?: string;
  isEmergency: boolean;
  type: string;
  status: "active" | "scheduled" | "expired";
  severity?: "low" | "medium" | "high" | "critical";
  createdBy: string; // Added missing field from your Firestore query
}

// More precise API response types using discriminated union
type ApiResponse =
  | {
      success: true;
      announcements: Announcement[];
      error?: never; // Ensures error can't be present in success case
      message?: never;
    }
  | {
      error: true;
      message: string;
      success?: never; // Ensures success can't be present in error case
      announcements?: never;
    };

export const getAnnouncementsByUserId = async (data: {
  token: string;
}): Promise<ApiResponse> => {
  try {
    const { token } = data;
    const verifiedToken = await serverAuth.verifyIdToken(token);
    const userRole = await checkUserRole(verifiedToken.uid);
    const userId = verifiedToken.uid;

    if (userRole !== "imam") {
      return {
        error: true,
        message: "Unauthorized: Only imams can view announcements.",
      };
    }

    const announcementRef = firestore.collection("announcements");
    const snapshot = await announcementRef
      .where("createdBy", "==", userId)
      .get();

    const announcements = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Explicit mapping for better type safety
      const announcement: Announcement = {
        id: doc.id,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt.toDate().toISOString(),
        isEmergency: data.isEmergency,
        type: data.type,
        status: data.status,
        createdBy: data.createdBy,
        // Optional fields with null checks
        expiryDate: data.expiryDate?.toDate?.()?.toISOString?.(),
        severity: data.severity,
      };

      return announcement;
    });

    return {
      success: true,
      announcements,
    };
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return {
      error: true,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching announcements.",
    };
  }
};

type EmergencyAlert = {
  title: string;
  description: string;
  alertType:
    | "janazah"
    | "missing_child"
    | "security"
    | "disaster"
    | "closure"
    | "other";
  severity: "low" | "medium" | "high" | "critical";
  isResolved: boolean;
  resolvedAt?: Timestamp;
  relatedMasjidId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
};

export const createEmergencyAlert = async (
  data: { token: string } & Omit<EmergencyAlert, "isResolved" | "resolvedAt">
) => {
  const { token, ...alertData } = data;

  // Authorization
  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message:
        "Unauthorized: Only imams and admins can create emergency alerts.",
    };
  }

  const uid = verifiedToken.uid;
  const timestamp = Timestamp.now();

  const alertToStore: EmergencyAlert = {
    ...alertData,
    isResolved: false,
    createdBy: uid,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // Store alert
  const alertRef = firestore.collection("emergencyAlerts").doc();
  await alertRef.set(alertToStore);

  // Send push notifications to all followers
  try {
    const masjidFollowers = await firestore
      .collection("users")
      .where("followedMasjids", "array-contains", alertData.relatedMasjidId)
      .get();

    const tokens = masjidFollowers.docs
      .map((doc) => doc.data().fcmToken)
      .filter((token) => token);

    if (tokens.length > 0) {
      await messaging.sendEachForMulticast({
        tokens,
        notification: {
          title: `[URGENT] ${alertData.title}`,
          body: alertData.description,
        },
        data: {
          alertId: alertRef.id,
          masjidId: alertData.relatedMasjidId,
          type: alertData.alertType,
        },
      });
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }

  return {
    success: true,
    message: "Emergency alert successfully created and notifications sent.",
    alertId: alertRef.id,
  };
};

export const resolveEmergencyAlert = async (data: {
  token: string;
  alertId: string;
}) => {
  const { token, alertId } = data;

  // Authorization
  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam" && userRole !== "admin") {
    return {
      error: true,
      message: "Unauthorized: Only imams and admins can resolve alerts.",
    };
  }

  const timestamp = Timestamp.now();

  await firestore.collection("emergencyAlerts").doc(alertId).update({
    isResolved: true,
    resolvedAt: timestamp,
    updatedAt: timestamp,
  });

  return {
    success: true,
    message: "Emergency alert marked as resolved.",
  };
};
