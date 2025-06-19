import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear all auth cookies
  response.cookies.delete("firebaseAuthToken");
  response.cookies.delete("firebaseAuthRefreshToken");
  response.cookies.delete("firebaseUserId");
  response.cookies.delete("userRole");

  return response;
}
