import "server-only";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { errorJson, json, preflight } from "@/lib/api/rest";
import { getUserFromRequest } from "@/lib/api/auth";

type Ctx = { params: Promise<{ id: string }> };

function canManage(role: string): boolean {
  return role === "SUPER_ADMIN";
}

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** POST /api/users/:id/reset-password — set a new password for a credential. */
export async function POST(req: NextRequest, { params }: Ctx) {
  const me = await getUserFromRequest(req);
  if (!me) return errorJson("Not authenticated.", 401, req);
  if (!canManage(me.role)) return errorJson("Forbidden.", 403, req);

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    password?: string;
  } | null;
  const password = body?.password;
  if (!password || password.length < 8) {
    return errorJson("Password must be at least 8 characters.", 400, req);
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { password: await bcrypt.hash(password, 12) },
    });
    return json({ ok: true }, req);
  } catch {
    return errorJson("Credential not found.", 404, req);
  }
}
