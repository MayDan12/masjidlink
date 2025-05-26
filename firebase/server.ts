import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./serviceAccount.json";
import { getMessaging } from "firebase-admin/messaging";
import { getStorage } from "firebase-admin/storage";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: "your-project-id.appspot.com", // ✅ Add this line
  });
}

export const firestore = getFirestore();
export const serverAuth = getAuth();
export const messaging = getMessaging();
export const storage = getStorage();
