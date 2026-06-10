import "server-only";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import {
  buildMeta,
  errorJson,
  json,
  parsePagination,
  parseSort,
  preflight,
} from "@/lib/api/rest";
import { getUserFromRequest, toAuthUser } from "@/lib/api/auth";

const SORTABLE = ["createdAt", "name", "email", "role"] as const;
const ROLES = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "SEO_MANAGER"];

/** Only the full-access role (SUPER_ADMIN) may manage credentials. */
function canManage(role: string): boolean {
  return role === "SUPER_ADMIN";
}

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/users — list credentials (password never leaves the server). */
export async function GET(req: NextRequest) {
  const me = await getUserFromRequest(req);
  if (!me) return errorJson("Not authenticated.", 401, req);
  if (!canManage(me.role)) return errorJson("Forbidden.", 403, req);

  const sp = req.nextUrl.searchParams;
  const pg = parsePagination(sp);
  const orderBy = parseSort(sp, SORTABLE, "createdAt");

  const where: Prisma.UserWhereInput = { deletedAt: null };
  const search = sp.get("search")?.trim();
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  const role = sp.get("role");
  if (role && ROLES.includes(role)) {
    where.role = role as Prisma.UserWhereInput["role"];
  }

  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: orderBy as Prisma.UserOrderByWithRelationInput,
      skip: pg.skip,
      take: pg.take,
    }),
  ]);

  return json({ data: rows.map(toAuthUser), meta: buildMeta(total, pg) }, req);
}

/** POST /api/users — issue a new credential. */
export async function POST(req: NextRequest) {
  const me = await getUserFromRequest(req);
  if (!me) return errorJson("Not authenticated.", 401, req);
  if (!canManage(me.role)) return errorJson("Forbidden.", 403, req);

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    isActive?: boolean;
  } | null;
  if (!body) return errorJson("Invalid request body.", 400, req);

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const role = body.role && ROLES.includes(body.role) ? body.role : "CONTENT_MANAGER";

  if (!name || !email || !password) {
    return errorJson("Name, email and password are required.", 400, req);
  }
  if (password.length < 8) {
    return errorJson("Password must be at least 8 characters.", 400, req);
  }

  const existing = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });
  if (existing) {
    return errorJson("A credential with this email already exists.", 409, req);
  }

  const created = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role: role as Prisma.UserCreateInput["role"],
      isActive: body.isActive ?? true,
    },
  });
  return json(toAuthUser(created), req, 201);
}
