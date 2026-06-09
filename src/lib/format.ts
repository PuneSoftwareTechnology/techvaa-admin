import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function formatDate(value?: string | null, pattern = 'DD MMM YYYY') {
  if (!value) return '—'
  return dayjs(value).format(pattern)
}

export function formatDateTime(value?: string | null) {
  if (!value) return '—'
  return dayjs(value).format('DD MMM YYYY, h:mm A')
}

export function fromNow(value?: string | null) {
  if (!value) return '—'
  return dayjs(value).fromNow()
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatFileSize(bytes: number) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/** Convert a title to a URL-safe slug. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Humanise an UPPER_SNAKE enum value, e.g. SOCIAL_MEDIA -> "Social media". */
export function humanizeEnum(value: string) {
  const lower = value.toLowerCase().replace(/_/g, ' ')
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}
