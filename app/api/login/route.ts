import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client"; // Your Firebase client config

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get the ID token
    const idToken = await user.getIdToken(true); // Force refresh
    const refreshToken = user.refreshToken;

    // Check user role from Firestore or your database
    const roleResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/checkroles`,
      {
        method: "POST",
        body: JSON.stringify({ uid: user.uid }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!roleResponse.ok) {
      throw new Error("Failed to fetch user role");
    }

    const { role } = await roleResponse.json();

    if (!role) {
      return NextResponse.json(
        { message: "No valid role assigned to user" },
        { status: 403 }
      );
    }

    // Create the response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userCredential,
      role,
      userId: user.uid,
    });

    // Set cookies on the server side

    // Set access token cookie
    response.cookies.set("firebaseAuthToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    // Set refresh token cookie
    response.cookies.set("firebaseAuthRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Set user ID cookie
    response.cookies.set("firebaseUserId", user.uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Set role cookie (optional, for easier middleware access)
    response.cookies.set("userRole", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle specific Firebase auth errors
    let errorMessage = "Login failed. Please try again.";

    if (error.code) {
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
    }

    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}
