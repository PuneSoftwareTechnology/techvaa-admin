import {
  BriefcaseIcon,
  GraduationCapIcon,
  InboxIcon,
  NewspaperIcon,
  StarIcon,
} from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { StatCard } from '../components/stat-card'
import { ChartCard } from '../components/chart-card'
import { LeadsAreaChart } from '../components/leads-area-chart'
import { StatusPieChart } from '../components/status-pie-chart'
import { CourseInterestChart } from '../components/course-interest-chart'
import { useDashboardAnalytics, useDashboardStats } from '../hooks/use-dashboard'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: analytics, isLoading: analyticsLoading } =
    useDashboardAnalytics()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of leads, content and placements across Techvaa."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Total Leads"
          value={stats?.totalLeads ?? 0}
          icon={InboxIcon}
          hint={`${stats?.newLeads ?? 0} new`}
          accent="text-chart-1 bg-chart-1/10"
          isLoading={statsLoading}
        />
        <StatCard
          label="Courses"
          value={stats?.totalCourses ?? 0}
          icon={GraduationCapIcon}
          hint={`${stats?.publishedCourses ?? 0} published`}
          accent="text-accent-orange bg-accent-orange/10"
          isLoading={statsLoading}
        />
        <StatCard
          label="Blogs"
          value={stats?.totalBlogs ?? 0}
          icon={NewspaperIcon}
          accent="text-chart-3 bg-chart-3/10"
          isLoading={statsLoading}
        />
        <StatCard
          label="Placements"
          value={stats?.totalPlacements ?? 0}
          icon={BriefcaseIcon}
          accent="text-chart-4 bg-chart-4/10"
          isLoading={statsLoading}
        />
        <StatCard
          label="Reviews"
          value={stats?.totalReviews ?? 0}
          icon={StarIcon}
          hint={stats ? `${stats.averageRating} avg rating` : undefined}
          accent="text-chart-5 bg-chart-5/10"
          isLoading={statsLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Monthly Leads"
          description="New enquiries over the last 6 months"
          isLoading={analyticsLoading}
          className="lg:col-span-2"
        >
          {analytics && <LeadsAreaChart data={analytics.monthlyLeads} />}
        </ChartCard>

        <ChartCard
          title="Leads by Status"
          description="Pipeline breakdown"
          isLoading={analyticsLoading}
        >
          {analytics &&
            (analytics.leadsByStatus.length ? (
              <StatusPieChart data={analytics.leadsByStatus} />
            ) : (
              <EmptyState title="No leads yet" />
            ))}
        </ChartCard>
      </div>

      <ChartCard
        title="Course Interest"
        description="Most requested courses by lead volume"
        isLoading={analyticsLoading}
      >
        {analytics &&
          (analytics.courseInterest.length ? (
            <CourseInterestChart data={analytics.courseInterest} />
          ) : (
            <EmptyState title="No course interest data yet" />
          ))}
      </ChartCard>
    </div>
  )
}
