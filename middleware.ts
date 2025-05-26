import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

// Type for role data
type RoleResponse = {
  role?: "user" | "imam" | "admin";
  error?: string;
};

export async function middleware(request: NextRequest) {
  const BaseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Skip middleware for POST requests
  if (request.method === "POST") {
    return NextResponse.next();
  }

  // Get tokens with retry fallback
  const { token, userId } = await getAuthTokens(request);

  if (!token || !userId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify token
    const decodedToken = decodeJwt(token);

    if (!decodedToken?.user_id) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check user role
    const { role: firestoreRole, error } = await checkUserRole(userId, BaseUrl);

    if (error || !firestoreRole) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Route authorization
    return authorizeRoute(request, firestoreRole);
  } catch (error) {
    console.error("MIDDLEWARE ERROR:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Helper function to get auth tokens with retry
async function getAuthTokens(request: NextRequest) {
  let token = request.cookies.get("firebaseAuthToken")?.value;
  let userId = request.cookies.get("firebaseUserId")?.value;

  if (!token || !userId) {
    const maxRetries = 3;
    const retryDelay = 100; // ms

    for (let i = 0; i < maxRetries; i++) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      const cookieStore = cookies();
      token = token || cookieStore.get("firebaseAuthToken")?.value;
      userId = userId || cookieStore.get("firebaseUserId")?.value;
      if (token && userId) break;
    }
  }

  return { token, userId };
}

// Helper function to check user role
async function checkUserRole(
  userId: string,
  baseUrl: string
): Promise<RoleResponse> {
  try {
    const roleResponse = await fetch(`${baseUrl}/api/auth/checkroles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: userId }),
    });

    if (!roleResponse.ok) {
      return { error: `HTTP ${roleResponse.status}` };
    }

    return (await roleResponse.json()) as RoleResponse;
  } catch (error) {
    console.error("Role check failed:", error);
    return { error: "Network error" };
  }
}

// Helper function for route authorization
function authorizeRoute(request: NextRequest, role: string) {
  const pathname = request.nextUrl.pathname;

  // Admin routes
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Imam routes
  if (pathname.startsWith("/imam") && role !== "imam") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // User routes
  if (pathname.startsWith("/dashboard") && role !== "user") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/imam/:path*", "/dashboard/:path*"],
};
