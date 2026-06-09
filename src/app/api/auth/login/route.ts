import "server-only";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { json, errorJson, preflight } from "@/lib/api/rest";
import { signToken, toAuthUser, sessionCookie } from "@/lib/api/auth";

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** POST /api/auth/login — verify credentials and issue a session token. */
export async function POST(req: NextRequest) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return errorJson("Invalid request body.", 400, req);
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return errorJson("Email and password are required.", 400, req);
  }

  const user = await prisma.user.findFirst({ where: { email, deletedAt: null } });
  // Compare even when no user is found to keep timing uniform.
  const hash =
    user?.password ??
    "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva";
  const ok = await bcrypt.compare(password, hash);

  if (!user || !ok) {
    return errorJson("Invalid email or password.", 401, req);
  }
  if (!user.isActive) {
    return errorJson(
      "This account has been deactivated. Contact an admin.",
      403,
      req
    );
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const token = signToken(user.id);
  const res = json({ user: toAuthUser(updated), token }, req);
  res.cookies.set(sessionCookie(token));
  return res;
}
