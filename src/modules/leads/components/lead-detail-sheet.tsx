import { MailIcon, PhoneIcon } from 'lucide-react'

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
import type { Lead } from '@/types/domain'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  )
}

export function LeadDetailSheet({
  lead,
  onOpenChange,
}: {
  lead: Lead | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={!!lead} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        {lead && (
          <>
            <SheetHeader>
              <SheetTitle>{lead.name}</SheetTitle>
              <SheetDescription>
                Enquiry received {formatDateTime(lead.createdAt)}
              </SheetDescription>
            </SheetHeader>

            <div className="px-4">
              <div className="flex flex-col gap-2">
                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <MailIcon className="size-4" />
                  {lead.email}
                </a>
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <PhoneIcon className="size-4" />
                    {lead.phone}
                  </a>
                )}
              </div>

              <Separator className="my-3" />

              <Row label="Status" value={<LeadStatusBadge status={lead.status} />} />

              {lead.message && (
                <>
                  <Separator className="my-3" />
                  <p className="mb-1 text-sm text-muted-foreground">Message</p>
                  <p className="rounded-lg bg-muted/50 p-3 text-sm">{lead.message}</p>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
