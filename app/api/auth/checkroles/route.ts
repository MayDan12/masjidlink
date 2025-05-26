// app/api/auth/role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkUserRole } from "@/context/checkroles"; // <- your server-only util

export async function POST(req: NextRequest) {
  const { uid } = await req.json();

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  const role = await checkUserRole(uid);
  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  return NextResponse.json({ role });
}
