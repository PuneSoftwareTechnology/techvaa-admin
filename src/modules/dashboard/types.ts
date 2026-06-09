import type { LeadStatus } from '@/types/domain'

export interface DashboardStats {
  totalLeads: number
  newLeads: number
  totalCourses: number
  publishedCourses: number
  totalBlogs: number
  totalPlacements: number
  totalReviews: number
  averageRating: number
}

export interface MonthlyLeadsPoint {
  /** Short month label, e.g. "Jan". */
  month: string
  leads: number
}

export interface LeadStatusPoint {
  status: LeadStatus
  label: string
  count: number
}

export interface CourseInterestPoint {
  course: string
  count: number
}

export interface DashboardAnalytics {
  monthlyLeads: MonthlyLeadsPoint[]
  leadsByStatus: LeadStatusPoint[]
  courseInterest: CourseInterestPoint[]
}
