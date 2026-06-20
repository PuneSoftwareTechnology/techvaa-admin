import "server-only";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { errorJson, json, noContent, preflight } from "@/lib/api/rest";
import { getUserFromRequest, toAuthUser } from "@/lib/api/auth";

type Ctx = { params: Promise<{ id: string }> };
const ROLES = ["SUPER_ADMIN", "ADMIN", "MARKETING_EXECUTIVE"];

function canManage(role: string): boolean {
  return role === "SUPER_ADMIN";
}

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** PATCH /api/users/:id — update name / role / active state. Email is immutable. */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const me = await getUserFromRequest(req);
  if (!me) return errorJson("Not authenticated.", 401, req);
  if (!canManage(me.role)) return errorJson("Forbidden.", 403, req);

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    name?: string;
    role?: string;
    isActive?: boolean;
  } | null;
  if (!body) return errorJson("Invalid request body.", 400, req);

  const data: Prisma.UserUpdateInput = {};
  if (typeof body.name === "string") data.name = body.name.trim();
  if (body.role && ROLES.includes(body.role)) {
    data.role = body.role as Prisma.UserUpdateInput["role"];
  }
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;

  try {
    const updated = await prisma.user.update({ where: { id }, data });
    return json(toAuthUser(updated), req);
  } catch {
    return errorJson("Credential not found.", 404, req);
  }
}

/** DELETE /api/users/:id — soft-delete and deactivate. */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const me = await getUserFromRequest(req);
  if (!me) return errorJson("Not authenticated.", 401, req);
  if (!canManage(me.role)) return errorJson("Forbidden.", 403, req);

  const { id } = await params;
  if (id === me.id) {
    return errorJson("You cannot delete your own credential.", 400, req);
  }
  try {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return noContent(req);
  } catch {
    return errorJson("Credential not found.", 404, req);
  }
}
