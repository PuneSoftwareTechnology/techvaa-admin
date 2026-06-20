import { useSearchParams } from 'react-router-dom'

import { PageHeader } from '@/components/common/page-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { hasPermission } from '@/constants/permissions'
import type { Permission } from '@/types/domain'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { LeadsPanel } from '@/modules/leads/components/leads-panel'
import { CourseEnquiriesPanel } from '@/modules/course-enquiries/components/course-enquiries-panel'
import { AllEnquiriesPanel } from '../components/all-enquiries-panel'

type EnquiryTab = 'all' | 'leads' | 'course-enquiries'

interface TabConfig {
  value: EnquiryTab
  label: string
  description: string
  /** Permissions the user must hold for this tab to be offered. */
  requires: Permission[]
}

const TABS: TabConfig[] = [
  {
    value: 'all',
    label: 'All',
    description: 'Every lead and course enquiry, newest first.',
    requires: ['leads', 'courseEnquiries'],
  },
  {
    value: 'leads',
    label: 'Leads',
    description: 'General enquiries from the contact form and floating banner.',
    requires: ['leads'],
  },
  {
    value: 'course-enquiries',
    label: 'Course Enquiries',
    description: '"Enroll Now" enquiries from the upcoming-batches table.',
    requires: ['courseEnquiries'],
  },
]

/**
 * Unified enquiries view. A dropdown in the table toolbar switches between the
 * combined "All" feed and the per-source Leads / Course Enquiries tables; only
 * the active panel mounts, so only it fetches. The active tab is mirrored to a
 * `?type=` query param for deep links and is gated per-permission — the "All"
 * feed is offered only to users who may see both sources.
 */
export default function EnquiriesPage() {
  const user = useAuthStore((s) => s.user)
  const [params, setParams] = useSearchParams()

  const visibleTabs = TABS.filter((t) =>
    t.requires.every((p) => hasPermission(user, p)),
  )
  const requested = params.get('type')
  const active = visibleTabs.find((t) => t.value === requested) ?? visibleTabs[0]

  // The route guard already requires one of the two permissions, so this is
  // only a defensive fallback.
  if (!active) return null

  const typeFilter =
    visibleTabs.length > 1 ? (
      <Select
        value={active.value}
        onValueChange={(v) => setParams({ type: v }, { replace: true })}
      >
        <SelectTrigger size="sm" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {visibleTabs.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : null

  return (
    <div className="space-y-5">
      <PageHeader title="Enquiries" description={active.description} />

      {active.value === 'all' && <AllEnquiriesPanel typeFilter={typeFilter} />}
      {active.value === 'leads' && <LeadsPanel typeFilter={typeFilter} />}
      {active.value === 'course-enquiries' && (
        <CourseEnquiriesPanel typeFilter={typeFilter} />
      )}
    </div>
  )
}
