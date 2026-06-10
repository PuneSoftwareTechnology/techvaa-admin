import {
  LayoutDashboard,
  GraduationCap,
  Newspaper,
  Star,
  Briefcase,
  HelpCircle,
  Inbox,
  ClipboardList,
  Images,
  Search,
  ShieldCheck,
  CalendarClock,
  CalendarDays,
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
   * (e.g. Dashboard) are visible to every authenticated user.
   */
  permission?: Permission
}

/** Primary sidebar navigation. Order drives the rendered menu. */
export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', to: '/', icon: LayoutDashboard, group: 'Overview' },
  {
    title: 'Leads',
    to: '/leads',
    icon: Inbox,
    group: 'Overview',
    permission: 'leads',
  },
  {
    title: 'Course Enquiries',
    to: '/course-enquiries',
    icon: ClipboardList,
    group: 'Overview',
    permission: 'courseEnquiries',
  },

  {
    title: 'Courses',
    to: '/courses',
    icon: GraduationCap,
    group: 'Content',
    permission: 'courses',
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
    title: 'Placements',
    to: '/placements',
    icon: Briefcase,
    group: 'Social proof',
    permission: 'placements',
  },

  {
    title: 'Batch Schedule — Home',
    to: '/batch-schedule/home',
    icon: CalendarClock,
    group: 'Schedule',
    permission: 'batchScheduleHome',
  },
  {
    title: 'Batch Schedule — Course',
    to: '/batch-schedule/course',
    icon: CalendarDays,
    group: 'Schedule',
    permission: 'batchScheduleCourse',
  },

  {
    title: 'Media',
    to: '/media',
    icon: Images,
    group: 'System',
    permission: 'media',
  },
  {
    title: 'SEO',
    to: '/seo',
    icon: Search,
    group: 'System',
    permission: 'seo',
  },
  {
    title: 'Credentials',
    to: '/credentials',
    icon: ShieldCheck,
    group: 'System',
    permission: 'credentials',
  },
]
