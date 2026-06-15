import "server-only";

/**
 * Tells the public website to drop its cached copy of a page right after the
 * admin writes content, so edits appear immediately instead of waiting for the
 * site's ISR window to lapse.
 *
 * Server-side only: the secret lives in `REVALIDATE_SECRET` (NOT a NEXT_PUBLIC_
 * var, so it never reaches the browser bundle). The target site is
 * `PUBLIC_SITE_URL` (e.g. https://www.techvaa.com). If either is unset this is a
 * no-op — the admin save still succeeds.
 *
 * Best-effort and never throws: a revalidation failure must not fail the save.
 */

/** Map a written resource + row to the public paths that should refresh. */
function pathsFor(resource: string, row: unknown): string[] {
  const slug = (row as { slug?: unknown })?.slug;
  if (typeof slug !== "string" || !slug) return [];
  if (resource === "courses") return [`/courses/${slug}`];
  if (resource === "blogs") return [`/blogs/${slug}`];
  return [];
}

export async function triggerRevalidate(
  resource: string,
  row?: unknown
): Promise<void> {
  const base = process.env.PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) return;

  const paths = row ? pathsFor(resource, row) : [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    await fetch(`${base.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ paths }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));
  } catch (error) {
    console.warn(`[revalidate] failed to refresh ${resource}:`, error);
  }
}
