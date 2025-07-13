import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { firestore } from "@/firebase/server"; // Use Admin SDK
// import { doc, getDoc } from "firebase/firestore"; // if needed

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const { uid } = decodedToken;

    if (!uid) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 🔍 Fetch role from Firestore
    const userSnap = await firestore.collection("users").doc(uid).get();
    const userData = userSnap.data();
    const role = userData?.role ?? "user";

    // 🍪 Set cookies
    const res = NextResponse.json({
      success: true,
      message: "Google login successful",
      userId: uid,
      role,
    });

    res.cookies.set("firebaseAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    res.cookies.set("firebaseUserId", uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    res.cookies.set("userRole", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json(
      { message: "Google login failed", error },
      { status: 500 }
    );
  }
}
