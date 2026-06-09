import "server-only";
import { unlink } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorJson, noContent, preflight } from "@/lib/api/rest";
import { getUserFromRequest } from "@/lib/api/auth";

type Ctx = { params: Promise<{ id: string }> };
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** DELETE /api/media/:id — remove the row and its local file (best-effort). */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!(await getUserFromRequest(req)))
    return errorJson("Not authenticated.", 401, req);

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return errorJson("Media not found.", 404, req);

  await prisma.media.delete({ where: { id } });
  // Locally-stored files live under public/uploads; ignore if already gone.
  if (media.url.startsWith("/uploads/")) {
    await unlink(path.join(UPLOAD_DIR, media.fileName)).catch(() => {});
  }
  return noContent(req);
}
