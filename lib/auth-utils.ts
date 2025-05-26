import { serverAuth } from "@/firebase/server";
import { cookies } from "next/headers";

const SESSION_EXPIRATION_IN_DAYS = 14;

export async function createSessionCookie(idToken: string) {
  const expiresIn = 60 * 60 * 24 * SESSION_EXPIRATION_IN_DAYS * 1000;
  const sessionCookie = await serverAuth.createSessionCookie(idToken, {
    expiresIn,
  });

  cookies().set({
    name: "session",
    value: sessionCookie,
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  });
}

export async function getCurrentUser() {
  const session = cookies().get("session")?.value;
  if (!session) return null;

  try {
    const decodedClaims = await serverAuth.verifySessionCookie(session, true);
    return decodedClaims;
  } catch (error) {
    return null;
  }
}
