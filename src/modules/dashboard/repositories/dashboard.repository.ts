import dayjs from 'dayjs'

import { http } from '@/api/http'
import { env } from '@/config/env'
import { delay } from '@/api/mock/utils'
import { mockDb } from '@/api/mock/db'
import { humanizeEnum } from '@/lib/format'
import { LEAD_STATUSES, type LeadStatus } from '@/types/domain'
import type { DashboardAnalytics, DashboardStats } from '../types'

/** Aggregate stats + analytics from the in-memory mock collections. */
function computeStats(): DashboardStats {
  const leads = mockDb.leads.all()
  const courses = mockDb.courses.all()
  const reviews = mockDb.reviews.all()
  const publishedRatings = reviews.map((r) => r.rating)
  const averageRating = publishedRatings.length
    ? publishedRatings.reduce((a, b) => a + b, 0) / publishedRatings.length
    : 0

  return {
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === 'NEW').length,
    totalCourses: courses.length,
    publishedCourses: courses.filter((c) => c.isPublished).length,
    totalBlogs: mockDb.blogs.all().length,
    totalPlacements: mockDb.placements.all().length,
    totalReviews: reviews.length,
    averageRating: Math.round(averageRating * 10) / 10,
  }
}

function computeAnalytics(): DashboardAnalytics {
  const leads = mockDb.leads.all()

  // Last 6 months, oldest -> newest.
  const months = Array.from({ length: 6 }).map((_, i) =>
    dayjs('2026-05-01').subtract(5 - i, 'month'),
  )
  const monthlyLeads = months.map((m) => ({
    month: m.format('MMM'),
    leads: leads.filter((l) => dayjs(l.createdAt).isSame(m, 'month')).length,
  }))

  const leadsByStatus = LEAD_STATUSES.map((status: LeadStatus) => ({
    status,
    label: humanizeEnum(status),
    count: leads.filter((l) => l.status === status).length,
  })).filter((s) => s.count > 0)

  const interestMap = new Map<string, number>()
  for (const lead of leads) {
    if (!lead.courseInterest) continue
    interestMap.set(
      lead.courseInterest,
      (interestMap.get(lead.courseInterest) ?? 0) + 1,
    )
  }
  const courseInterest = [...interestMap.entries()]
    .map(([course, count]) => ({ course, count }))
    .sort((a, b) => b.count - a.count)

  return { monthlyLeads, leadsByStatus, courseInterest }
}

export const dashboardRepository = {
  async getStats(): Promise<DashboardStats> {
    if (env.useMock) return delay(computeStats())
    const { data } = await http.get<DashboardStats>('/dashboard/stats')
    return data
  },
  async getAnalytics(): Promise<DashboardAnalytics> {
    if (env.useMock) return delay(computeAnalytics())
    const { data } = await http.get<DashboardAnalytics>('/dashboard/analytics')
    return data
  },
}
