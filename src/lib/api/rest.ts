import "server-only";
import { NextResponse } from "next/server";

/**
 * Shared helpers for the admin's own REST API (this Next app serves both the
 * SPA and these routes — same origin, so CORS is a non-issue; the helpers
 * stay permissive in case the API is ever called cross-origin).
 *
 * They mirror the admin SPA's `ListParams` / `Paginated<T>` / `ApiError`
 * contract so the existing repository layer works unchanged.
 */

/** Pagination block in the admin SPA's `Paginated<T>` response shape. */
export type AdminPaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/** Valid `LeadStatus` values (shared by Lead and CourseEnquiry). */
export const LEAD_STATUSES = new Set([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CLOSED",
  "LOST",
]);

/** Permissive CORS — reflects the caller's origin so credentialed XHR works. */
export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

/** Standard preflight response. */
export function preflight(req: Request): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/** JSON success response with CORS headers attached. */
export function json(data: unknown, req: Request, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: corsHeaders(req) });
}

/** JSON error in the admin's `ApiError` shape (`{ message }`). */
export function errorJson(
  message: string,
  status: number,
  req: Request
): NextResponse {
  return NextResponse.json({ message }, { status, headers: corsHeaders(req) });
}

/** 204 No Content with CORS headers (used by DELETE). */
export function noContent(req: Request): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export type Pagination = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
};

/** Parse `page` / `pageSize` (clamped) from the query string. */
export function parsePagination(sp: URLSearchParams): Pagination {
  const page = Math.max(1, toInt(sp.get("page"), 1));
  const pageSize = Math.min(100, Math.max(1, toInt(sp.get("pageSize"), 10)));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

/** Parse `sortBy` / `sortOrder`, whitelisting the column to avoid bad orderings. */
export function parseSort(
  sp: URLSearchParams,
  sortable: readonly string[],
  defaultSort: string
): { [k: string]: "asc" | "desc" } {
  const requested = sp.get("sortBy") ?? "";
  const sortBy = sortable.includes(requested) ? requested : defaultSort;
  const sortOrder = sp.get("sortOrder") === "asc" ? "asc" : "desc";
  return { [sortBy]: sortOrder };
}

/** Build the admin's pagination meta block. */
export function buildMeta(
  total: number,
  { page, pageSize }: Pagination
): AdminPaginationMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Case-insensitive `contains` OR across the given string columns. */
export function searchOr(
  search: string | null,
  fields: readonly string[]
): Record<string, unknown>[] | undefined {
  const q = search?.trim();
  if (!q) return undefined;
  return fields.map((f) => ({ [f]: { contains: q, mode: "insensitive" } }));
}

function toInt(value: string | null, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}
