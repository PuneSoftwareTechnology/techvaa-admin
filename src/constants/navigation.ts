import {
  LayoutDashboard,
  GraduationCap,
  Newspaper,
  Star,
  Quote,
  Briefcase,
  HelpCircle,
  ListChecks,
  Inbox,
  ShieldCheck,
  CalendarClock,
  type LucideIcon,
} from 'lucide-react'

import type { Permission } from '@/types/domain'

export interface NavItem {
  title: string
  to: string
  icon: LucideIcon
  /** Optional grouping label rendered as a section heading. */
  group?: string
  /**
   * RBAC permission required to see this item. Items without a permission
   * (e.g. Dashboard) are visible to every authenticated user. A list means the
   * user needs hold any one of the permissions.
   */
  permission?: Permission | Permission[]
}

/** Primary sidebar navigation. Order drives the rendered menu. */
export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', to: '/', icon: LayoutDashboard, group: 'Overview' },
  {
    title: 'Enquiries',
    to: '/enquiries',
    icon: Inbox,
    group: 'Overview',
    permission: ['leads', 'courseEnquiries'],
  },

  {
    title: 'Courses',
    to: '/courses',
    icon: GraduationCap,
    group: 'Content',
    permission: 'courses',
  },
  {
    title: 'Curriculum',
    to: '/curriculum',
    icon: ListChecks,
    group: 'Content',
    permission: 'curriculum',
  },
  {
    title: 'Blogs',
    to: '/blogs',
    icon: Newspaper,
    group: 'Content',
    permission: 'blogs',
  },
  {
    title: 'FAQs',
    to: '/faqs',
    icon: HelpCircle,
    group: 'Content',
    permission: 'faqs',
  },

  {
    title: 'Reviews',
    to: '/reviews',
    icon: Star,
    group: 'Social proof',
    permission: 'reviews',
  },
  {
    title: 'Testimonials',
    to: '/testimonials',
    icon: Quote,
    group: 'Social proof',
    permission: 'testimonials',
  },
  {
    title: 'Placements',
    to: '/placements',
    icon: Briefcase,
    group: 'Social proof',
    permission: 'placements',
  },

  {
    title: 'Batch Schedule',
    to: '/batch-schedule',
    icon: CalendarClock,
    group: 'Schedule',
    permission: 'batchSchedule',
  },

  {
    title: 'Credentials',
    to: '/credentials',
    icon: ShieldCheck,
    group: 'System',
    permission: 'credentials',
  },
]
