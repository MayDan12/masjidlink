import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

type Role = "user" | "imam" | "admin";
type RoleResponse = { role?: Role; error?: string };

export async function middleware(request: NextRequest) {
  // Skip POST requests
  if (request.method === "POST") return NextResponse.next();

  const { token, userId } = getAuthTokens(request);

  if (!token || !userId) return redirectToLogin(request);

  try {
    const decoded = decodeJwt(token);
    if (!decoded?.user_id) return redirectToLogin(request);

    const { role, error } = await checkUserRole(userId);
    if (error || !role) return redirectToLogin(request);

    return authorizeRoute(request, role);
  } catch (err) {
    console.error("[Middleware Error]", err);
    return redirectToLogin(request);
  }
}

function getAuthTokens(request: NextRequest) {
  const cookieStore = cookies();
  const token =
    request.cookies.get("firebaseAuthToken")?.value ||
    cookieStore.get("firebaseAuthToken")?.value;
  const userId =
    request.cookies.get("firebaseUserId")?.value ||
    cookieStore.get("firebaseUserId")?.value;
  return { token, userId };
}

async function checkUserRole(userId: string): Promise<RoleResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/checkroles`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userId }),
        cache: "no-store",
      }
    );

    if (!res.ok) return { error: `HTTP ${res.status}` };
    return (await res.json()) as RoleResponse;
  } catch (err) {
    console.error("[Role Check Error]", err);
    return { error: "Network error" };
  }
}

function authorizeRoute(request: NextRequest, role: Role) {
  const pathname = request.nextUrl.pathname;

  const accessMap: Record<string, Role[]> = {
    "/admin": ["admin"],
    "/imam": ["imam"],
    "/dashboard": ["user"],
    "/livestream": ["admin", "imam", "user"],
  };

  for (const [routePrefix, allowedRoles] of Object.entries(accessMap)) {
    if (pathname.startsWith(routePrefix) && !allowedRoles.includes(role)) {
      return redirectToLogin(request);
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/imam/:path*",
    "/dashboard/:path*",
    "/livestream/:path*",
  ],
};
