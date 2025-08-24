"use server";

import { firestore, serverAuth } from "@/firebase/server";
import { sanitizeData } from "@/lib/sanitize";
import { checkUserRole } from "@/utils/server/auth";
import { Timestamp } from "firebase-admin/firestore";

export const uploadImage = async (formData: FormData, token: string) => {
  const verifiedToken = await serverAuth.verifyIdToken(token);
  const userRole = await checkUserRole(verifiedToken.uid);
  const userId = verifiedToken.uid;

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
    // 1. Upload to Cloudinary
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

    const imageUrl = result.secure_url;

    // 2. Update Firebase Auth photoURL
    try {
      await serverAuth.updateUser(userId, {
        photoURL: imageUrl,
      });
    } catch (authError) {
      console.error("Failed to update Firebase Auth photoURL:", authError);
      // Continue even if this fails - we'll still have the profile update
    }

    // 3. Update your profile system (assuming you have this function)
    // try {
    //   await updateUserProfile(userId, {
    //     profilePicture: imageUrl,
    //   });
    // } catch (profileError) {
    //   console.error("Failed to update user profile:", profileError);
    //   throw new Error("Image uploaded but profile update failed");
    // }

    return {
      success: true,
      message: "Image uploaded and profile updated successfully.",
      imageUrl: imageUrl,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Image upload process failed:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to upload image",
    };
  }
};
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

// export const uploadImage = async (formData: FormData, token: string) => {
//   const verifiedToken = await serverAuth.verifyIdToken(token);
//   const userRole = await checkUserRole(verifiedToken.uid);

//   if (userRole !== "user" && userRole !== "imam") {
//     return {
//       error: true,
//       message: "Unauthorized: Only users can update their profile.",
//     };
//   }

//   const file = formData.get("image") as File;
//   if (!file) {
//     return {
//       error: true,
//       message: "No image file provided.",
//     };
//   }

//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const blob = new Blob([buffer], { type: file.type });

//     const cloudinaryForm = new FormData();
//     cloudinaryForm.append("file", blob, file.name);
//     cloudinaryForm.append(
//       "upload_preset",
//       process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
//     );

//     const uploadResponse = await fetch(
//       `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//       {
//         method: "POST",
//         body: cloudinaryForm,
//       }
//     );

//     const result = await uploadResponse.json();

//     if (result.error) {
//       throw new Error(result.error.message);
//     }

//     return {
//       success: true,
//       message: "Image uploaded successfully.",
//       imageUrl: result.secure_url,
//       publicId: result.public_id,
//     };
//   } catch (error) {
//     console.error("Cloudinary upload failed:", error);
//     return {
//       error: true,
//       message: "Failed to upload image to Cloudinary.",
//     };
//   }
// };

// Update your existing updateProfile function to handle the image URL
