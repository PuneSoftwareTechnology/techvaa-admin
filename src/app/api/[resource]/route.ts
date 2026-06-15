import "server-only";
import type { NextRequest } from "next/server";
import {
  buildMeta,
  errorJson,
  json,
  parsePagination,
  parseSort,
  preflight,
} from "@/lib/api/rest";
import { getUserFromRequest } from "@/lib/api/auth";
import {
  buildWhere,
  delegate,
  getResource,
  pickWritable,
  relationWrites,
  seoNestedWrite,
  shape,
} from "@/lib/api/resources";
import { triggerRevalidate } from "@/lib/api/revalidate";

type Ctx = { params: Promise<{ resource: string }> };

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/:resource — paginated, searchable, filterable list. */
export async function GET(req: NextRequest, { params }: Ctx) {
  if (!(await getUserFromRequest(req)))
    return errorJson("Not authenticated.", 401, req);

  const { resource } = await params;
  const cfg = getResource(resource);
  if (!cfg) return errorJson(`Unknown resource: ${resource}`, 404, req);

  const sp = req.nextUrl.searchParams;
  const pg = parsePagination(sp);
  const orderBy = parseSort(sp, cfg.sortable, cfg.defaultSort);
  const where = buildWhere(cfg, sp);
  const model = delegate(cfg);

  const [total, rows] = await Promise.all([
    model.count({ where }),
    model.findMany({
      where,
      orderBy,
      skip: pg.skip,
      take: pg.take,
      include: cfg.include,
    }),
  ]);

  return json(
    { data: rows.map((r: unknown) => shape(cfg, r)), meta: buildMeta(total, pg) },
    req
  );
}

/** POST /api/:resource — create. */
export async function POST(req: NextRequest, { params }: Ctx) {
  if (!(await getUserFromRequest(req)))
    return errorJson("Not authenticated.", 401, req);

  const { resource } = await params;
  const cfg = getResource(resource);
  if (!cfg) return errorJson(`Unknown resource: ${resource}`, 404, req);
  if (cfg.noCreate)
    return errorJson(`${cfg.label} records cannot be created here.`, 405, req);

  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) return errorJson("Invalid request body.", 400, req);

  const data = pickWritable(cfg, body);
  if (cfg.seoRelation) {
    const seo = seoNestedWrite(body.seo, "create");
    if (seo) data.seo = seo;
  }
  Object.assign(data, relationWrites(cfg, body, "create"));
  try {
    const created = await delegate(cfg).create({
      data,
      include: cfg.include,
    });
    await triggerRevalidate(resource, created);
    return json(shape(cfg, created), req, 201);
  } catch (err) {
    return errorJson(prismaMessage(err, cfg.label), prismaStatus(err), req);
  }
}

/** Map common Prisma write errors to friendly messages/status. */
export function prismaMessage(err: unknown, label: string): string {
  const code = (err as { code?: string })?.code;
  if (code === "P2002") return `A ${label.toLowerCase()} with that value already exists.`;
  if (code === "P2003") return "A related record was not found.";
  if (code === "P2025") return `${label} not found.`;
  return "The request could not be completed.";
}

export function prismaStatus(err: unknown): number {
  const code = (err as { code?: string })?.code;
  if (code === "P2002") return 409;
  if (code === "P2025") return 404;
  return 400;
}
