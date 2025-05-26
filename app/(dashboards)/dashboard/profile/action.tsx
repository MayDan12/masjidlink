"use server";

import { firestore, serverAuth } from "@/firebase/server";
import { sanitizeData } from "@/lib/sanitize";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";

export const uploadImage = async (formData: FormData, token: string) => {
  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "user" && userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only users can update their profile.",
    };
  }

  const file = formData.get("image") as File;
  if (!file) {
    return {
      error: true,
      message: "No image file provided.",
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const blob = new Blob([buffer], { type: file.type });

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", blob, file.name);
    cloudinaryForm.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudinaryForm,
      }
    );

    const result = await uploadResponse.json();

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      success: true,
      message: "Image uploaded successfully.",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return {
      error: true,
      message: "Failed to upload image to Cloudinary.",
    };
  }
};

// Update your existing updateProfile function to handle the image URL
export const updateProfile = async (data: {
  name: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  skills?: string;
  occupation?: string;
  languages?: string;
  token: string;
}) => {
  const { token, ...profileData } = data;
  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "user" && userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only users can update their profile.",
    };
  }

  const uid = verifiedToken.uid;
  const userDocRef = firestore.collection("users").doc(uid);

  try {
    await userDocRef.update({
      ...profileData,
      updatedAt: Timestamp.now(),
    });

    await serverAuth.updateUser(uid, {
      displayName: profileData.name, // Set the displayName to the new name from the form
    });

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (err) {
    console.error("Profile update failed:", err);
    return {
      error: true,
      message: "Failed to update profile.",
    };
  }
};

// Fetch user profile data
export const getUsersProfile = async (token: string) => {
  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);

  if (userRole !== "user" && userRole !== "imam") {
    return {
      error: true,
      message: "Unauthorized: Only users can access their profile.",
    };
  }

  try {
    const uid = verifiedToken.uid;
    const userDocRef = firestore.collection("users").doc(uid);
    const doc = await userDocRef.get();

    const docData = sanitizeData(doc.data());

    return {
      success: true,
      data: docData,
    };
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return {
      error: true,
      message: "Failed to fetch user profile.",
    };
  }
};
