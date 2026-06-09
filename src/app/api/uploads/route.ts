import "server-only";
import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { errorJson, json, preflight } from "@/lib/api/rest";
import { getUserFromRequest } from "@/lib/api/auth";
import { uploadImage } from "@/lib/s3";
import { isUploadFolder } from "@/lib/upload-folders";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/**
 * POST /api/uploads — multipart image upload to S3.
 *
 * Body: `file` (image) + `folder` (one of UPLOAD_FOLDERS, e.g. "courses" /
 * "blogs") + optional `slug`. Stores at
 * s3://techvaa/<folder>/<slug>/<name>-<rand>.<ext> and returns `{ url }`.
 */
export async function POST(req: NextRequest) {
  const me = await getUserFromRequest(req);
  if (!me) return errorJson("Not authenticated.", 401, req);

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return errorJson("No file provided.", 400, req);
  }
  if (!ACCEPTED.has(file.type)) {
    return errorJson("Unsupported image type.", 400, req);
  }
  if (file.size > MAX_FILE_SIZE) {
    return errorJson("Image exceeds the 5 MB limit.", 400, req);
  }

  const folder = form?.get("folder");
  if (!isUploadFolder(folder)) {
    return errorJson("Invalid or missing upload folder.", 400, req);
  }

  const rawSlug = form?.get("slug");
  const slug = typeof rawSlug === "string" && rawSlug.trim() ? rawSlug : "misc";

  try {
    const { url } = await uploadImage(folder, slug, file, randomUUID().slice(0, 8));
    return json({ url }, req, 201);
  } catch (err) {
    console.error("S3 image upload failed:", err);
    return errorJson("Upload failed. Please try again.", 502, req);
  }
}
