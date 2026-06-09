import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
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
import { getUserFromRequest } from "@/lib/api/auth";

const SORTABLE = ["createdAt", "originalName", "fileSize"] as const;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/media — paginated asset list. */
export async function GET(req: NextRequest) {
  if (!(await getUserFromRequest(req)))
    return errorJson("Not authenticated.", 401, req);

  const sp = req.nextUrl.searchParams;
  const pg = parsePagination(sp);
  const orderBy = parseSort(sp, SORTABLE, "createdAt");

  const where: Prisma.MediaWhereInput = {};
  const search = sp.get("search")?.trim();
  if (search) {
    where.OR = [
      { originalName: { contains: search, mode: "insensitive" } },
      { fileType: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, data] = await Promise.all([
    prisma.media.count({ where }),
    prisma.media.findMany({
      where,
      orderBy: orderBy as Prisma.MediaOrderByWithRelationInput,
      skip: pg.skip,
      take: pg.take,
    }),
  ]);

  return json({ data, meta: buildMeta(total, pg) }, req);
}

/**
 * POST /api/media — multipart upload.
 *
 * NOTE: no S3 is configured, so for local dev the file is written to
 * `public/uploads` and served from `/uploads/<name>`. Swap this for an S3
 * putObject before deploying to a serverless/edge host (public/ isn't writable
 * there).
 */
export async function POST(req: NextRequest) {
  const me = await getUserFromRequest(req);
  if (!me) return errorJson("Not authenticated.", 401, req);

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return errorJson("No file provided.", 400, req);
  }

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${Date.now()}-${safe}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(
    path.join(UPLOAD_DIR, key),
    Buffer.from(await file.arrayBuffer())
  );

  const media = await prisma.media.create({
    data: {
      fileName: key,
      originalName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      url: `/uploads/${key}`,
      uploadedById: me.id,
    },
  });
  return json(media, req, 201);
}
