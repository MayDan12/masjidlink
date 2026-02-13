"use server";

import { firestore, serverAuth } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
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

// let's add the image upload action

export const uploadMasjidImage = async (data: {
  id?: string;
  imageUrl: string;
  name: string;
  type: string;
  token: string;
}) => {
  const { token, ...masjidImage } = data;

  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can update their profile.",
    };
  }

  const uid = verifiedToken.uid;
  const userDocRef = firestore.collection("masjids").doc(uid);
  // add id to the image object
  const imageId = randomInt(1000000, 9999999).toString();

  // add id to the image object
  masjidImage.id = imageId;

  await userDocRef.update({
    images: FieldValue.arrayUnion({
      ...masjidImage,
      createdAt: new Date().toISOString(),
    }),
    updatedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: "Masjid image uploaded successfully.",
  };
};

// Get images array
export const getMasjidImages = async (token: string) => {
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
    data: sanitizedData.images,
  };
};

export const deleteMasjidImage = async (token: string, imageId: string) => {
  if (!imageId) {
    return {
      error: true,
      message: "Image ID is required.",
    };
  }

  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only imams can update their profile.",
    };
  }

  const uid = verifiedToken.uid;
  const userDocRef = firestore.collection("masjids").doc(uid);

  const userSnap = await userDocRef.get();

  if (!userSnap.exists) {
    return {
      error: true,
      message: "Masjid not found.",
    };
  }

  const data = userSnap.data();
  const images = data?.images || [];

  const updatedImages = images.filter((image: any) => image.id !== imageId);

  await userDocRef.update({
    images: updatedImages,
    updatedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: "Masjid image deleted successfully.",
  };
};
