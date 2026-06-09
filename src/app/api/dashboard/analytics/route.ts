import "server-only";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorJson, json, preflight } from "@/lib/api/rest";
import { getUserFromRequest } from "@/lib/api/auth";

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "LOST"] as const;

/** Title-case an enum value, e.g. NEW -> "New". */
function humanize(s: string): string {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

/** GET /api/dashboard/analytics — charts: monthly leads, status split, interest. */
export async function GET(req: NextRequest) {
  if (!(await getUserFromRequest(req)))
    return errorJson("Not authenticated.", 401, req);

  // Window: the first day of the month five months ago, through now (6 buckets).
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [recentLeads, byStatus, withInterest] = await Promise.all([
    prisma.lead.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true },
    }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({
      where: { courseInterest: { not: null } },
      select: { courseInterest: true },
    }),
  ]);

  // Monthly buckets, oldest -> newest.
  const monthlyLeads = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const leads = recentLeads.filter((l) => {
      const c = l.createdAt;
      return (
        c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth()
      );
    }).length;
    return { month: MONTHS[d.getMonth()], leads };
  });

  const statusCounts = new Map(
    byStatus.map((g) => [g.status, g._count._all])
  );
  const leadsByStatus = LEAD_STATUSES.map((status) => ({
    status,
    label: humanize(status),
    count: statusCounts.get(status) ?? 0,
  })).filter((s) => s.count > 0);

  const interestMap = new Map<string, number>();
  for (const l of withInterest) {
    const c = l.courseInterest;
    if (!c) continue;
    interestMap.set(c, (interestMap.get(c) ?? 0) + 1);
  }
  const courseInterest = [...interestMap.entries()]
    .map(([course, count]) => ({ course, count }))
    .sort((a, b) => b.count - a.count);

  return json({ monthlyLeads, leadsByStatus, courseInterest }, req);
}
