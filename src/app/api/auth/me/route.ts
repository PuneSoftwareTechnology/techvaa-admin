import "server-only";
import type { NextRequest } from "next/server";
import { json, errorJson, preflight } from "@/lib/api/rest";
import { getUserFromRequest, toAuthUser } from "@/lib/api/auth";

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/auth/me — the current session's user, or 401. */
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return errorJson("Not authenticated.", 401, req);
  return json(toAuthUser(user), req);
}
