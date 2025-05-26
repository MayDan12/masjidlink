"use server";

import { firestore, serverAuth } from "@/firebase/server";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";

type EventType = "lecture" | "janazah" | "iftar" | "class" | "other";
type RecurringFrequency = "daily" | "weekly" | "monthly";

export const createEvents = async (data: {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  type: EventType | "";
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency | "";
  isPublic: boolean;
  maxAttendees?: string;
  token: string;
}) => {
  const { token, ...eventData } = data;

  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can create events.",
    };
  }

  const uid = verifiedToken.uid;
  const timestamp = Timestamp.now();

  const eventToStore = {
    ...eventData,
    createdBy: uid,
    createdAt: timestamp,
    updatedAt: timestamp,
    rsvps: [], // 👈 Initialize RSVP list
  };

  // Use auto-generated ID for each new event
  const eventRef = firestore.collection("events").doc(); // 👈 New doc ID
  await eventRef.set(eventToStore);

  return {
    success: true,
    message: "Event successfully created.",
    eventId: eventRef.id,
  };
};

export const updateEvent = async (data: {
  eventId: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  type: EventType | "";
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency | "";
  isPublic: boolean;
  maxAttendees?: string;
  token: string;
}) => {
  const { token, ...eventData } = data;

  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can update events.",
    };
  }

  const uid = verifiedToken.uid;
  const timestamp = Timestamp.now();

  const eventToUpdate = {
    ...eventData,
    updatedBy: uid,
    updatedAt: timestamp,
    rsvps: [], // 👈 Initialize RSVP list
  };

  // Use the provided event ID to update the specific event
  const eventRef = firestore.collection("events").doc(data.eventId);
  await eventRef.update(eventToUpdate);

  return {
    success: true,
    message: "Event successfully updated.",
    eventId: data.eventId,
  };
};

export const deleteEvent = async (data: { eventId: string; token: string }) => {
  const { token, eventId } = data;

  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can delete events.",
    };
  }

  // Use the provided event ID to delete the specific event
  const eventRef = firestore.collection("events").doc(eventId);
  await eventRef.delete();

  return {
    success: true,
    message: "Event successfully deleted.",
  };
};

// export const rsvpToEvent = async (data: {
//   eventId: string;
//   userId: string;
//   token: string;
// }) => {
//   const { token, ...rsvpData } = data;

//   const verifiedToken = await serverAuth.verifyIdToken(token);
//   const userRole = await checkUserRole(verifiedToken.uid);

//   if (userRole !== "imam") {
//     return {
//       error: true,
//       message: "Unauthorized: Only imams can RSVP to events.",
//     };
//   }

//   const uid = verifiedToken.uid;
//   const timestamp = Timestamp.now();

//   const rsvpToStore = {
//     ...rsvpData,
//     createdBy: uid,
//     createdAt: timestamp,
//   };

//   // Use the provided event ID to add RSVP to the specific event
//   const eventRef = firestore.collection("events").doc(data.eventId);
//   await eventRef.update({
//     rsvps: firestore.FieldValue.arrayUnion(rsvpToStore),
//   });

//   return {
//     success: true,
//     message: "RSVP successfully recorded.",
//     rsvpId: rsvpToStore.userId,
//   };
// };

// export const cancelRsvp = async (data: {
//   eventId: string;
//   userId: string;
//   token: string;
// }) => {
//   const { token, ...rsvpData } = data;

//   const verifiedToken = await serverAuth.verifyIdToken(token);
//   const userRole = await checkUserRole(verifiedToken.uid);

//   if (userRole !== "imam") {
//     return {
//       error: true,
//       message: "Unauthorized: Only imams can cancel RSVPs.",
//     };
//   }

//   // Use the provided event ID to remove RSVP from the specific event
//   const eventRef = firestore.collection("events").doc(data.eventId);
//   await eventRef.update({
//     rsvps: firestore.FieldValue.arrayRemove(rsvpData),
//   });

//   return {
//     success: true,
//     message: "RSVP successfully canceled.",
//   };
// };

export const getEvents = async (data: {
  token: string;
  startDate: string;
  endDate: string;
}) => {
  const { token, startDate, endDate } = data;

  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can view events.",
    };
  }

  // Fetch events between the specified dates
  const eventsRef = firestore.collection("events");
  const snapshot = await eventsRef
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .get();

  const events = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    success: true,
    events,
  };
};

export const getEventById = async (data: {
  token: string;
  eventId: string;
}) => {
  const { token, eventId } = data;

  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can view events.",
    };
  }

  // Fetch the specific event by ID
  const eventRef = firestore.collection("events").doc(eventId);
  const doc = await eventRef.get();

  if (!doc.exists) {
    return {
      error: true,
      message: "Event not found.",
    };
  }

  return {
    success: true,
    event: { id: doc.id, ...doc.data() },
  };
};

// export const getEventsByUserId = async (data: { token: string }) => {
//   const { token } = data;

//   const verifiedToken = await serverAuth.verifyIdToken(token);
//   const userRole = await checkUserRole(verifiedToken.uid);
//   const userId = verifiedToken.uid; // Use the authenticated user's ID

//   if (userRole !== "imam") {
//     return {
//       error: true,
//       message: "Unauthorized: Only imams can view events.",
//     };
//   }

//   // Fetch events created by the specific user
//   const eventsRef = firestore.collection("events");
//   const snapshot = await eventsRef.where("createdBy", "==", userId).get();

//   const events = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   return {
//     success: true,
//     events,
//   };
// };

export const getEventsByUserId = async (data: { token: string }) => {
  const { token } = data;

  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);
  const userId = verifiedToken.uid;

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can view events.",
    };
  }

  const eventsRef = firestore.collection("events");
  const snapshot = await eventsRef.where("createdBy", "==", userId).get();

  const events = snapshot.docs.map((doc) => {
    const data = doc.data();

    // Convert Firestore Timestamps to ISO strings
    const convertedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value?.toDate) {
        // Check if it's a Firestore Timestamp
        convertedData[key] = value.toDate().toISOString();
      } else {
        convertedData[key] = value;
      }
    }

    return {
      id: doc.id,
      ...convertedData,
    };
  });

  return {
    success: true,
    events,
  };
};
