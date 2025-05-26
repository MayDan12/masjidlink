import { firestore } from "@/firebase/server";

export async function checkUserRole(uid: string): Promise<string | null> {
  try {
    const userDoc = await firestore.collection("users").doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData?.role;
    } else {
      console.log("User document not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return null;
  }
}
