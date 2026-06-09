import "server-only";
import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";
import { permissionsForRole } from "@/constants/permissions";

/**
 * Minimal, dependency-free session tokens for the admin SPA.
 *
 * A token is `base64url(payload).base64url(HMAC-SHA256(payload))`, where the
 * payload is `{ sub: userId, exp: epochSeconds }`. We sign with `AUTH_SECRET`.
 * Because the SPA and API are same-origin, the httpOnly cookie is the primary
 * transport; the returned token (sent as `Authorization: Bearer`) is a backup.
 */

export const AUTH_COOKIE = "techvaa_admin_session";
/** Session lifetime: 7 days. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("Missing AUTH_SECRET in environment");
  return s;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function hmac(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signToken(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = b64url(JSON.stringify({ sub: userId, exp }));
  return `${payload}.${hmac(payload)}`;
}

/** Returns the userId for a valid, unexpired token, or null. */
export function verifyToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = hmac(payload);
  // Constant-time compare to avoid leaking signature bytes via timing.
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const { sub, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof sub !== "string" || typeof exp !== "number") return null;
    if (exp < Math.floor(Date.now() / 1000)) return null;
    return sub;
  } catch {
    return null;
  }
}

/** Extract a token from the session cookie first, then the bearer header. */
export function tokenFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get(AUTH_COOKIE)?.value;
  if (cookie) return cookie;
  const bearer = req.headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) return bearer.slice(7).trim();
  return null;
}

/** Resolve the authenticated, active user for a request (or null). */
export async function getUserFromRequest(req: NextRequest): Promise<User | null> {
  const userId = verifyToken(tokenFromRequest(req));
  if (!userId) return null;
  return prisma.user.findFirst({
    where: { id: userId, isActive: true, deletedAt: null },
  });
}

/**
 * Map a Prisma `User` to the admin SPA's `User` shape (strips the password
 * hash). Permissions are derived from the user's role (the single source of
 * truth lives in constants/permissions). SUPER_ADMIN holds every permission;
 * other roles get their fixed set. The client uses this list to gate nav/routes.
 */
export function toAuthUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    permissions: permissionsForRole(u.role),
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

/** Attributes for the session cookie (httpOnly, same-origin). */
export function sessionCookie(token: string) {
  return {
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
