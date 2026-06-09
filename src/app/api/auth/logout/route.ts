import "server-only";
import type { NextRequest } from "next/server";
import { json, preflight } from "@/lib/api/rest";
import { AUTH_COOKIE } from "@/lib/api/auth";

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** POST /api/auth/logout — clear the session cookie. */
export async function POST(req: NextRequest) {
  const res = json({ ok: true }, req);
  res.cookies.set({ name: AUTH_COOKIE, value: "", path: "/", maxAge: 0 });
  return res;
}
