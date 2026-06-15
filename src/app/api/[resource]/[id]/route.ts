import "server-only";
import type { NextRequest } from "next/server";
import { errorJson, json, noContent, preflight } from "@/lib/api/rest";
import { getUserFromRequest } from "@/lib/api/auth";
import {
  delegate,
  getResource,
  pickWritable,
  relationWrites,
  seoNestedWrite,
  shape,
} from "@/lib/api/resources";
import { triggerRevalidate } from "@/lib/api/revalidate";
import { prismaMessage, prismaStatus } from "../route";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/:resource/:id */
export async function GET(req: NextRequest, { params }: Ctx) {
  if (!(await getUserFromRequest(req)))
    return errorJson("Not authenticated.", 401, req);

  const { resource, id } = await params;
  const cfg = getResource(resource);
  if (!cfg) return errorJson(`Unknown resource: ${resource}`, 404, req);

  const where = cfg.softDelete ? { id, deletedAt: null } : { id };
  const row = await delegate(cfg).findFirst({ where, include: cfg.include });
  if (!row) return errorJson(`${cfg.label} not found.`, 404, req);
  return json(shape(cfg, row), req);
}

/** PATCH /api/:resource/:id */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await getUserFromRequest(req)))
    return errorJson("Not authenticated.", 401, req);

  const { resource, id } = await params;
  const cfg = getResource(resource);
  if (!cfg) return errorJson(`Unknown resource: ${resource}`, 404, req);

  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) return errorJson("Invalid request body.", 400, req);

  const data = pickWritable(cfg, body);
  if (cfg.seoRelation) {
    const seo = seoNestedWrite(body.seo, "update");
    if (seo) data.seo = seo;
  }
  Object.assign(data, relationWrites(cfg, body, "update"));
  try {
    const updated = await delegate(cfg).update({
      where: { id },
      data,
      include: cfg.include,
    });
    await triggerRevalidate(resource, updated);
    return json(shape(cfg, updated), req);
  } catch (err) {
    return errorJson(prismaMessage(err, cfg.label), prismaStatus(err), req);
  }
}

/** DELETE /api/:resource/:id — soft-delete when the table supports it. */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!(await getUserFromRequest(req)))
    return errorJson("Not authenticated.", 401, req);

  const { resource, id } = await params;
  const cfg = getResource(resource);
  if (!cfg) return errorJson(`Unknown resource: ${resource}`, 404, req);

  try {
    if (cfg.softDelete) {
      await delegate(cfg).update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } else {
      await delegate(cfg).delete({ where: { id } });
    }
    await triggerRevalidate(resource);
    return noContent(req);
  } catch (err) {
    return errorJson(prismaMessage(err, cfg.label), prismaStatus(err), req);
  }
}
