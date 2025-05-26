"use server";

import { serverAuth } from "@/firebase/server";
import { cookies } from "next/headers";

export const removeToken = async () => {
  try {
    const cookieStore = cookies();
    cookieStore.delete("firebaseAuthToken");
    cookieStore.delete("firebaseAuthRefreshToken");
    cookieStore.delete("firebaseUserId");
  } catch (error) {
    console.error("Error removing accessToken:", error);
    throw error;
  }
};

// Function to set Firebase authentication tokens in cookies
export const setToken = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  try {
    const verifyToken = await serverAuth.verifyIdToken(accessToken);
    if (!verifyToken) {
      throw new Error("Invalid accessToken");
    }

    const userRecord = await serverAuth.getUser(verifyToken.uid);
    if (
      process.env.ADMIN_EMAIL === userRecord.email &&
      userRecord.customClaims?.admin
    ) {
      // Set custom claims for admin user
      serverAuth.setCustomUserClaims(verifyToken.uid, {
        admin: true,
      });
    }
    const userId = userRecord.uid;

    const cookieStore = cookies();
    cookieStore.set("firebaseAuthToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set("firebaseAuthRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set("firebaseUserId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    console.error("Error setting accessToken:", error);
    throw error;
  }
};
