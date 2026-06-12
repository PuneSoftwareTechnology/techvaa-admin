import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/layouts/admin-layout'
import { ProtectedRoute } from '@/modules/auth/components/protected-route'
import { PublicRoute } from '@/modules/auth/components/public-route'
import { RequirePermission } from '@/modules/auth/components/require-permission'
import { RouteFallback } from '@/components/common/route-fallback'

// Route-based code splitting — every page is a dynamic import.
const LoginPage = lazy(() => import('@/modules/auth/pages/login-page'))
const DashboardPage = lazy(
  () => import('@/modules/dashboard/pages/dashboard-page'),
)
const CoursesPage = lazy(() => import('@/modules/courses/pages/courses-page'))
const CurriculumPage = lazy(
  () => import('@/modules/curriculum/pages/curriculum-page'),
)
const CourseBatchesPage = lazy(
  () => import('@/modules/course-batches/pages/course-batches-page'),
)
const BlogsPage = lazy(() => import('@/modules/blogs/pages/blogs-page'))
const ReviewsPage = lazy(() => import('@/modules/reviews/pages/reviews-page'))
const TestimonialsPage = lazy(
  () => import('@/modules/testimonials/pages/testimonials-page'),
)
const PlacementsPage = lazy(
  () => import('@/modules/placements/pages/placements-page'),
)
const FaqsPage = lazy(() => import('@/modules/faqs/pages/faqs-page'))
const LeadsPage = lazy(() => import('@/modules/leads/pages/leads-page'))
const CourseEnquiriesPage = lazy(
  () => import('@/modules/course-enquiries/pages/course-enquiries-page'),
)
const CredentialsPage = lazy(
  () => import('@/modules/access/pages/credentials-page'),
)
const NotFoundPage = lazy(() => import('@/components/common/not-found'))

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* Dashboard is the safe landing route — always reachable. */}
            <Route index element={<DashboardPage />} />
            <Route
              path="courses"
              element={
                <RequirePermission permission="courses">
                  <CoursesPage />
                </RequirePermission>
              }
            />
            <Route
              path="curriculum"
              element={
                <RequirePermission permission="curriculum">
                  <CurriculumPage />
                </RequirePermission>
              }
            />
            <Route
              path="batch-schedule"
              element={
                <RequirePermission permission="batchSchedule">
                  <CourseBatchesPage />
                </RequirePermission>
              }
            />
            {/* Old split routes now collapse into the single toggled page. */}
            <Route
              path="batch-schedule/home"
              element={<Navigate to="/batch-schedule" replace />}
            />
            <Route
              path="batch-schedule/course"
              element={<Navigate to="/batch-schedule" replace />}
            />
            <Route
              path="blogs"
              element={
                <RequirePermission permission="blogs">
                  <BlogsPage />
                </RequirePermission>
              }
            />
            <Route
              path="reviews"
              element={
                <RequirePermission permission="reviews">
                  <ReviewsPage />
                </RequirePermission>
              }
            />
            <Route
              path="testimonials"
              element={
                <RequirePermission permission="testimonials">
                  <TestimonialsPage />
                </RequirePermission>
              }
            />
            <Route
              path="placements"
              element={
                <RequirePermission permission="placements">
                  <PlacementsPage />
                </RequirePermission>
              }
            />
            <Route
              path="faqs"
              element={
                <RequirePermission permission="faqs">
                  <FaqsPage />
                </RequirePermission>
              }
            />
            <Route
              path="leads"
              element={
                <RequirePermission permission="leads">
                  <LeadsPage />
                </RequirePermission>
              }
            />
            <Route
              path="course-enquiries"
              element={
                <RequirePermission permission="courseEnquiries">
                  <CourseEnquiriesPage />
                </RequirePermission>
              }
            />
            <Route
              path="credentials"
              element={
                <RequirePermission permission="credentials">
                  <CredentialsPage />
                </RequirePermission>
              }
            />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
