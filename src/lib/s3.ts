import "server-only";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { UploadFolder } from "./upload-folders";

/**
 * Minimal S3 wrapper for site media (course & blog images, etc.).
 *
 * Objects live in a single bucket (`S3_BUCKET`, default "techvaa") under a
 * `<folder>/<slug>/<file>` key, served publicly via the bucket policy. Locally
 * the AWS SDK resolves credentials from `~/.aws`; in production set
 * AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
 */
export const S3_REGION = process.env.AWS_REGION ?? "ap-south-1";
export const S3_BUCKET = process.env.S3_BUCKET ?? "techvaa";

/** Public base URL objects are served from (CloudFront-friendly override). */
const PUBLIC_BASE =
  process.env.S3_PUBLIC_URL?.replace(/\/$/, "") ??
  `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;

// Reuse a single client across hot reloads in development.
const globalForS3 = globalThis as unknown as { s3: S3Client | undefined };

export const s3 =
  globalForS3.s3 ??
  new S3Client({
    region: S3_REGION,
    // Explicit keys take precedence; otherwise fall back to the default
    // provider chain (env / shared ~/.aws credentials / IAM role).
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForS3.s3 = s3;

/** Lowercase, hyphenate and strip a path segment to something S3/URL-safe. */
export function safeSegment(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || "untitled"
  );
}

/** Map a MIME type to a sensible file extension. */
function extFor(fileName: string, contentType: string): string {
  const fromName = fileName.includes(".")
    ? fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase()
    : "";
  if (fromName) return fromName.replace(/[^a-z0-9]/g, "");
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };
  return map[contentType] ?? "bin";
}

/**
 * Upload an image and return its public URL.
 *
 * Key shape: `<folder>/<slug>/<image-name>-<rand>.<ext>` so re-uploading under
 * the same entity doesn't collide while staying grouped per entity.
 */
export async function uploadImage(
  folder: UploadFolder,
  slug: string,
  file: File,
  rand: string
): Promise<{ url: string; key: string }> {
  const contentType = file.type || "application/octet-stream";
  const base = safeSegment(file.name.replace(/\.[^.]+$/, "")) || "image";
  const ext = extFor(file.name, contentType);
  const key = `${folder}/${safeSegment(slug)}/${base}-${rand}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return { url: `${PUBLIC_BASE}/${key}`, key };
}
