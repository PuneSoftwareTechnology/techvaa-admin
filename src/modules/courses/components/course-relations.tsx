import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormDialog } from '@/components/data/form-dialog'
import { ConfirmDialog } from '@/components/data/confirm-dialog'
import { formatDate } from '@/lib/format'
import { htmlToText } from '@/lib/rich-text'
import type { CrudHooks } from '@/hooks/use-crud-controller'
import type { ListParams } from '@/types/api'
import type { Entity } from '@/types/crud'
import type { CourseBatch, CurriculumItem, Faq } from '@/types/domain'

import { curriculumHooks } from '@/modules/curriculum/hooks/use-curriculum'
import { CurriculumForm } from '@/modules/curriculum/components/curriculum-form'
import {
  CURRICULUM_DEFAULTS,
  type CurriculumFormValues,
} from '@/modules/curriculum/validations/curriculum.schema'
import { courseBatchHooks } from '@/modules/course-batches/hooks/use-course-batches'
import { CourseBatchForm } from '@/modules/course-batches/components/course-batch-form'
import {
  COURSE_BATCH_DEFAULTS,
  type CourseBatchFormValues,
} from '@/modules/course-batches/validations/course-batch.schema'
import { faqHooks } from '@/modules/faqs/hooks/use-faqs'
import { FaqForm } from '@/modules/faqs/components/faq-form'
import { FAQ_DEFAULTS, type FaqFormValues } from '@/modules/faqs/validations/faq.schema'

import { CourseSection } from './course-form'

/**
 * The curriculum / batches / FAQs attached to a course, surfaced inside the
 * course edit modal. Each panel lists its items and opens the matching module
 * form (in a nested dialog) to create or edit one — pre-linked to this course.
 */
export function CourseRelations({
  courseId,
  onUnlock,
  onNestedOpenChange,
}: {
  /** The saved course's id. Absent while creating a brand-new course. */
  courseId?: string
  /** Called from a locked panel's button to save the course first. */
  onUnlock?: () => void
  /** Reports whether any nested panel dialog is currently open. */
  onNestedOpenChange?: (open: boolean) => void
}) {
  const locked = !courseId
  const cid = courseId ?? ''

  // Aggregate the open state of every panel's nested dialog so the parent
  // course dialog can lock itself against implicit dismissal while one is open.
  const openPanels = useRef(new Set<string>())
  const reportOpen = (key: string, open: boolean) => {
    if (open) openPanels.current.add(key)
    else openPanels.current.delete(key)
    onNestedOpenChange?.(openPanels.current.size > 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-foreground">Linked content</span>
        <span className="h-px flex-1 bg-border" />
        {locked && (
          <span className="text-xs text-muted-foreground">
            Adding any of these saves the course first.
          </span>
        )}
      </div>

      <div className="space-y-5">
        <RelationPanel<Faq, FaqFormValues>
          title="FAQs"
          accent="violet"
          locked={locked}
          onUnlock={onUnlock}
          hooks={faqHooks}
          listParams={{ pageSize: 100, sortBy: 'sortOrder', sortOrder: 'asc' }}
          // FAQs link to courses via an m2m, so filter client-side by courseIds.
          filterRows={(rows) => rows.filter((f) => f.courseIds?.includes(cid))}
          formId="faq-rel-form"
          singular="FAQ"
          primaryText={(f) => f.question}
          secondaryText={(f) => htmlToText(f.answer)}
          toForm={(f) => ({
            question: f.question,
            answer: f.answer,
            sortOrder: f.sortOrder,
            isPublished: f.isPublished,
            showOnHomepage: f.showOnHomepage,
            courseIds: f.courseIds ?? [],
          })}
          newForm={{ ...FAQ_DEFAULTS, courseIds: [cid] }}
          renderForm={(p) => <FaqForm {...p} />}
          onOpenChange={(o) => reportOpen('faqs', o)}
        />

        <RelationPanel<CurriculumItem, CurriculumFormValues>
          title="Curriculum"
          accent="sky"
          locked={locked}
          onUnlock={onUnlock}
          hooks={curriculumHooks}
          listParams={{
            filters: { courseId: cid },
            pageSize: 100,
            sortBy: 'sortOrder',
            sortOrder: 'asc',
          }}
          formId="curriculum-rel-form"
          singular="curriculum item"
          primaryText={(i) => i.heading}
          secondaryText={(i) => i.description}
          toForm={(i) => ({
            courseId: i.courseId,
            heading: i.heading,
            description: i.description,
            sortOrder: i.sortOrder,
          })}
          newForm={{ ...CURRICULUM_DEFAULTS, courseId: cid }}
          renderForm={(p) => <CurriculumForm {...p} />}
          onOpenChange={(o) => reportOpen('curriculum', o)}
        />

        <RelationPanel<CourseBatch, CourseBatchFormValues>
          title="Scheduled batches"
          accent="amber"
          locked={locked}
          onUnlock={onUnlock}
          hooks={courseBatchHooks}
          listParams={{
            filters: { courseId: cid },
            pageSize: 100,
            sortBy: 'startDate',
            sortOrder: 'asc',
          }}
          formId="batch-rel-form"
          singular="batch"
          primaryText={(b) => formatDate(b.startDate)}
          secondaryText={(b) =>
            `${b.duration} · ${b.isOpen ? 'Enrolment open' : 'Closed'}`
          }
          toForm={(b) => ({
            courseId: b.courseId,
            startDate: b.startDate.slice(0, 10),
            duration: b.duration,
            mode: b.mode ?? '',
            timing: b.timing ?? '',
            status: b.status,
            isOpen: b.isOpen,
          })}
          newForm={{ ...COURSE_BATCH_DEFAULTS, courseId: cid }}
          renderForm={(p) => <CourseBatchForm {...p} />}
          onOpenChange={(o) => reportOpen('batches', o)}
        />
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- RelationPanel */

interface RelationPanelProps<T extends Entity, F> {
  title: string
  accent: 'sky' | 'amber' | 'violet'
  /** Before the course is saved: hide the list and route Add to `onUnlock`. */
  locked?: boolean
  onUnlock?: () => void
  hooks: CrudHooks<T, F, Partial<F>>
  listParams: ListParams
  /** Optional client-side filter (used for FAQs, which link via an m2m). */
  filterRows?: (rows: T[]) => T[]
  formId: string
  singular: string
  primaryText: (row: T) => string
  secondaryText?: (row: T) => string | undefined
  toForm: (row: T) => F
  newForm: F
  renderForm: (props: {
    formId: string
    defaultValues?: F
    onSubmit: (values: F) => void
  }) => ReactNode
  dialogClassName?: string
  /** Notifies the parent when this panel's nested dialog opens or closes. */
  onOpenChange?: (open: boolean) => void
}

function RelationPanel<T extends Entity, F>({
  title,
  accent,
  locked,
  onUnlock,
  hooks,
  listParams,
  filterRows,
  formId,
  singular,
  primaryText,
  secondaryText,
  toForm,
  newForm,
  renderForm,
  dialogClassName,
  onOpenChange,
}: RelationPanelProps<T, F>) {
  const { data, isLoading } = hooks.useList(listParams)
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useDelete()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)

  useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  const all = data?.data ?? []
  const rows = filterRows ? filterRows(all) : all

  const openCreate = () => {
    setEditing(null)
    setOpen(true)
  }

  const submit = async (values: F) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, dto: values as Partial<F> })
    } else {
      await createMutation.mutateAsync(values)
    }
    setOpen(false)
  }

  return (
    <CourseSection
      title={!locked && rows.length ? `${title} (${rows.length})` : title}
      accent={accent}
      action={
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="-my-1 h-7"
          onClick={locked ? onUnlock : openCreate}
        >
          <PlusIcon className="size-3.5" />
          Add
        </Button>
      }
    >
      {locked ? (
        <div className="flex flex-col items-start gap-2.5 py-1">
          <p className="text-sm text-muted-foreground">
            Save the course to add {singular}s.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={onUnlock}>
            <PlusIcon className="size-3.5" />
            Create {singular}
          </Button>
        </div>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-start gap-2.5 py-1">
          <p className="text-sm text-muted-foreground">
            No {singular} linked to this course yet.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={openCreate}>
            <PlusIcon className="size-3.5" />
            Create {singular}
          </Button>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {primaryText(row)}
                </p>
                {secondaryText?.(row) && (
                  <p className="truncate text-xs text-muted-foreground">
                    {secondaryText(row)}
                  </p>
                )}
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                title={`Edit ${singular}`}
                onClick={() => {
                  setEditing(row)
                  setOpen(true)
                }}
              >
                <PencilIcon className="size-3.5" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                title={`Delete ${singular}`}
                onClick={() => setDeleteTarget(row)}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {!locked && (
        <>
          <FormDialog
            open={open}
            onOpenChange={setOpen}
            title={editing ? `Edit ${singular}` : `New ${singular}`}
            formId={formId}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            submitLabel={editing ? 'Save changes' : 'Create'}
            className={dialogClassName}
          >
            {renderForm({
              formId,
              defaultValues: editing ? toForm(editing) : newForm,
              onSubmit: submit,
            })}
          </FormDialog>

          <ConfirmDialog
            open={!!deleteTarget}
            onOpenChange={(o) => !o && setDeleteTarget(null)}
            title={`Delete this ${singular}?`}
            description={deleteTarget ? primaryText(deleteTarget) : undefined}
            confirmLabel="Delete"
            loading={deleteMutation.isPending}
            onConfirm={() => {
              if (!deleteTarget) return
              deleteMutation.mutate(deleteTarget.id, {
                onSuccess: () => setDeleteTarget(null),
              })
            }}
          />
        </>
      )}
    </CourseSection>
  )
}
