"use server";

import { firestore, serverAuth } from "@/firebase/server";
import { sanitizeData } from "@/lib/sanitize";
import { checkUserRole } from "@/utils/server/auth";
import { randomInt } from "crypto";

export const saveMasjidProfile = async (data: {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;
  establishedYear?: string;
  capacity?: string;
  denomination?: string;
  facilityTypes: string[];
  token: string;
}) => {
  const { token, ...masjidData } = data;
  // Validate input data
  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can update their profile.",
    };
  }

  // Update masjid profile in Firestore
  const uid = verifiedToken.uid;
  const userDocRef = firestore.collection("masjids").doc(uid);
  await userDocRef.update({
    ...masjidData,
    rating: randomInt(2, 5),
    updatedAt: new Date().toISOString(),
  });
  return {
    success: true,
    message: "Masjid profile updated successfully.",
  };
};

export const saveMasjidSocials = async (data: {
  email: string;
  phone: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  token: string;
}) => {
  const { token, ...masjidSocials } = data;
  // Validate input data
  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can update their profile.",
    };
  }

  // Update masjid profile in Firestore
  const uid = verifiedToken.uid;
  const userDocRef = firestore.collection("masjids").doc(uid);
  await userDocRef.update({
    social: {
      ...masjidSocials,
    },
    updatedAt: new Date().toISOString(),
  });
  return {
    success: true,
    message: "Masjid profile updated successfully.",
  };
};

export const getMasjidProfile = async (token: string) => {
  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can update their profile.",
    };
  }

  // Update masjid profile in Firestore
  const uid = verifiedToken.uid;
  const userDocRef = firestore.collection("masjids").doc(uid);
  const doc = await userDocRef.get();

  if (!doc.exists) {
    return {
      error: true,
      message: "Masjid profile not found.",
    };
  }
  const sanitizedData = sanitizeData(doc.data());

  return {
    success: true,
    data: sanitizedData,
  };
};
