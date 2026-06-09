import { GraduationCapIcon, PhoneIcon } from 'lucide-react'

import { formatDateTime } from '@/lib/format'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { LeadStatusBadge } from '@/components/common/badges'
import type { CourseEnquiry } from '@/types/domain'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  )
}

export function CourseEnquiryDetailSheet({
  enquiry,
  onOpenChange,
}: {
  enquiry: CourseEnquiry | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={!!enquiry} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        {enquiry && (
          <>
            <SheetHeader>
              <SheetTitle>{enquiry.name}</SheetTitle>
              <SheetDescription>
                Enquiry received {formatDateTime(enquiry.createdAt)}
              </SheetDescription>
            </SheetHeader>

            <div className="px-4">
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${enquiry.phone}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <PhoneIcon className="size-4" />
                  {enquiry.phone}
                </a>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCapIcon className="size-4" />
                  {enquiry.course}
                </span>
              </div>

              <Separator className="my-3" />

              <Row
                label="Status"
                value={<LeadStatusBadge status={enquiry.status} />}
              />
              <Row label="Course" value={enquiry.course} />

              {enquiry.message && (
                <>
                  <Separator className="my-3" />
                  <p className="mb-1 text-sm text-muted-foreground">Message</p>
                  <p className="rounded-lg bg-muted/50 p-3 text-sm">
                    {enquiry.message}
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
