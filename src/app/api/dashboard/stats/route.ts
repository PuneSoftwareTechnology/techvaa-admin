import "server-only";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorJson, json, preflight } from "@/lib/api/rest";
import { getUserFromRequest } from "@/lib/api/auth";

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

/** GET /api/dashboard/stats — headline counters for the dashboard cards. */
export async function GET(req: NextRequest) {
  if (!(await getUserFromRequest(req)))
    return errorJson("Not authenticated.", 401, req);

  const live = { deletedAt: null };
  const [
    totalLeads,
    newLeads,
    totalCourses,
    publishedCourses,
    totalBlogs,
    totalPlacements,
    totalReviews,
    ratingAgg,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.course.count({ where: live }),
    prisma.course.count({ where: { ...live, isPublished: true } }),
    prisma.blog.count({ where: live }),
    prisma.placement.count({ where: live }),
    prisma.review.count({ where: live }),
    prisma.review.aggregate({ where: live, _avg: { rating: true } }),
  ]);

  return json(
    {
      totalLeads,
      newLeads,
      totalCourses,
      publishedCourses,
      totalBlogs,
      totalPlacements,
      totalReviews,
      averageRating: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
    },
    req
  );
}
