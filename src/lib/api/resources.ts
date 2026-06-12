import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Config-driven CRUD registry. The dynamic routes under `src/app/api/[resource]`
 * read these descriptors so every straightforward content table is served by a
 * single pair of handlers instead of one hand-written route file per resource.
 *
 * Resources that don't map cleanly to a Prisma table (media uploads, page-level
 * SEO, user credentials, dashboard aggregates) have their own explicit routes
 * and are deliberately absent here.
 */

type Coerce = "int" | "float" | "date";

type Filter =
  | { kind: "enum"; values: readonly string[] }
  | { kind: "boolean" }
  | { kind: "eq" };

export type ResourceConfig = {
  /** Prisma delegate name, e.g. "course" -> prisma.course. */
  model: string;
  label: string;
  searchable: string[];
  sortable: readonly string[];
  defaultSort: string;
  /** Tables with a `deletedAt` column soft-delete and hide deleted rows. */
  softDelete: boolean;
  /** Fields accepted from the request body on create/update. */
  writable: string[];
  /** Disallow create (read + status-update + delete only). */
  noCreate?: boolean;
  /** Body fields where an empty string should be stored as null. */
  nullableBlanks?: string[];
  coerce?: Record<string, Coerce>;
  /** Relations to include on reads. */
  include?: Record<string, unknown>;
  /** Query-string filters -> Prisma where clauses. Keyed by param name. */
  filters?: Record<string, Filter>;
  /** Final tweak to the write payload (e.g. derive publishedAt). */
  onWrite?: (data: Record<string, unknown>) => Record<string, unknown>;
  /** Shape a row after read (e.g. flatten _count). */
  transform?: (row: Record<string, unknown>) => unknown;
  /**
   * When true, a `seo` object in the request body is upserted into the related
   * 1:1 SeoMetadata row (per-entity SEO override). Left blank -> no row, and the
   * public site falls back to the entity's own fields.
   */
  seoRelation?: boolean;
  /**
   * Implicit many-to-many relations writable from the form. Keyed by the Prisma
   * relation field; the value is the request-body field holding an array of ids.
   * On create the ids are `connect`ed; on update the whole set is `set`.
   */
  relations?: Record<string, string>;
};

const ROBOTS_VALUES = [
  "INDEX_FOLLOW",
  "NOINDEX_FOLLOW",
  "INDEX_NOFOLLOW",
  "NOINDEX_NOFOLLOW",
] as const;

const LEAD_STATUS_VALUES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CLOSED",
  "LOST",
] as const;

export const RESOURCES: Record<string, ResourceConfig> = {
  courses: {
    model: "course",
    label: "Course",
    searchable: ["title", "slug"],
    sortable: ["createdAt", "title", "isPublished"],
    defaultSort: "createdAt",
    softDelete: true,
    writable: [
      "title",
      "slug",
      "shortDescription",
      "description",
      "duration",
      "image",
      "isFeatured",
      "isPublished",
    ],
    nullableBlanks: ["shortDescription", "duration", "image"],
    include: {
      seo: true,
      relatedCourses: { select: { id: true, title: true, slug: true } },
    },
    seoRelation: true,
    // Curated related courses (self m2m), written from the form's id array.
    relations: { relatedCourses: "relatedCourseIds" },
    // Expose the related course ids as a flat array for the form's multi-select.
    transform: (row) => {
      const related =
        (row.relatedCourses as { id: string }[] | undefined) ?? [];
      return { ...row, relatedCourseIds: related.map((c) => c.id) };
    },
    filters: {
      isPublished: { kind: "boolean" },
      isFeatured: { kind: "boolean" },
    },
  },

  // Key-curriculum rows, each linked to a single course via courseId.
  "curriculum-items": {
    model: "curriculumItem",
    label: "Curriculum item",
    searchable: ["heading", "description"],
    sortable: ["order", "createdAt", "heading"],
    defaultSort: "order",
    softDelete: false,
    writable: ["courseId", "heading", "description", "order"],
    coerce: { order: "int" },
    include: {
      course: { select: { id: true, title: true, slug: true } },
    },
    filters: {
      courseId: { kind: "eq" },
    },
  },

  // Upcoming batches, each linked to a single course via courseId.
  "course-batches": {
    model: "courseBatch",
    label: "Batch",
    searchable: ["duration"],
    sortable: ["startDate", "createdAt"],
    defaultSort: "startDate",
    softDelete: false,
    writable: [
      "courseId",
      "startDate",
      "duration",
      "isOpen",
      "showOnHomepage",
    ],
    coerce: { startDate: "date" },
    include: {
      course: { select: { id: true, title: true, slug: true } },
    },
    filters: {
      courseId: { kind: "eq" },
      isOpen: { kind: "boolean" },
      showOnHomepage: { kind: "boolean" },
    },
  },

  blogs: {
    model: "blog",
    label: "Blog",
    searchable: ["title", "slug", "excerpt"],
    sortable: ["createdAt", "title", "publishedAt", "isPublished"],
    defaultSort: "createdAt",
    softDelete: true,
    writable: [
      "title",
      "slug",
      "excerpt",
      "content",
      "featuredImage",
      "readingTime",
      "isPublished",
    ],
    nullableBlanks: ["excerpt", "featuredImage"],
    coerce: { readingTime: "int" },
    include: {
      seo: true,
    },
    seoRelation: true,
    filters: {
      isPublished: { kind: "boolean" },
    },
    onWrite: (d) => {
      // Stamp publishedAt the first time a post is published.
      if (d.isPublished === true && d.publishedAt == null) {
        d.publishedAt = new Date();
      }
      return d;
    },
  },

  reviews: {
    model: "review",
    label: "Review",
    searchable: ["studentName", "company", "designation"],
    sortable: ["createdAt", "rating", "isPublished"],
    defaultSort: "createdAt",
    softDelete: true,
    writable: [
      "studentName",
      "company",
      "designation",
      "rating",
      "review",
      "image",
      "isPublished",
    ],
    nullableBlanks: ["company", "designation", "image"],
    coerce: { rating: "int" },
    filters: { isPublished: { kind: "boolean" } },
  },

  testimonials: {
    model: "testimonial",
    label: "Testimonial",
    searchable: ["name", "company", "role"],
    sortable: ["createdAt", "isPublished"],
    defaultSort: "createdAt",
    softDelete: true,
    writable: [
      "name",
      "role",
      "company",
      "message",
      "image",
      "videoUrl",
      "isPublished",
    ],
    nullableBlanks: ["role", "company", "image", "videoUrl"],
    filters: { isPublished: { kind: "boolean" } },
  },

  placements: {
    model: "placement",
    label: "Placement",
    searchable: ["studentName", "company", "course"],
    sortable: ["createdAt", "joiningDate", "company"],
    defaultSort: "createdAt",
    softDelete: true,
    writable: [
      "studentName",
      "company",
      "package",
      "course",
      "image",
      "linkedinUrl",
      "joiningDate",
      "isPublished",
    ],
    nullableBlanks: ["package", "course", "image", "linkedinUrl", "joiningDate"],
    coerce: { joiningDate: "date" },
    filters: { isPublished: { kind: "boolean" } },
  },

  faqs: {
    model: "faq",
    label: "FAQ",
    searchable: ["question", "answer"],
    sortable: ["sortOrder", "createdAt"],
    defaultSort: "sortOrder",
    softDelete: true,
    writable: ["question", "answer", "sortOrder", "isPublished", "showOnHomepage"],
    coerce: { sortOrder: "int" },
    include: { courses: { select: { id: true, title: true, slug: true } } },
    relations: { courses: "courseIds" },
    // Expose the attached course ids as a flat array for the form's multi-select.
    transform: (row) => {
      const courses = (row.courses as { id: string }[] | undefined) ?? [];
      return { ...row, courseIds: courses.map((c) => c.id) };
    },
    filters: {
      isPublished: { kind: "boolean" },
      showOnHomepage: { kind: "boolean" },
    },
  },

  leads: {
    model: "lead",
    label: "Lead",
    searchable: ["name", "email", "phone"],
    sortable: ["createdAt", "name", "status"],
    defaultSort: "createdAt",
    softDelete: false,
    noCreate: true,
    writable: ["status"],
    filters: { status: { kind: "enum", values: LEAD_STATUS_VALUES } },
  },

  "course-enquiries": {
    model: "courseEnquiry",
    label: "Enquiry",
    searchable: ["name", "phone", "course"],
    sortable: ["createdAt", "name", "status"],
    defaultSort: "createdAt",
    softDelete: false,
    noCreate: true,
    writable: ["status"],
    filters: { status: { kind: "enum", values: LEAD_STATUS_VALUES } },
  },

  // Tier-1 SEO: metadata for the site's fixed pages (Home, Courses list, …).
  // `keywords` is a Postgres text[]; the admin form sends it as an array.
  "page-seo": {
    model: "pageSeo",
    label: "Page SEO",
    searchable: ["page", "path", "metaTitle"],
    sortable: ["page", "path", "createdAt", "updatedAt"],
    defaultSort: "page",
    softDelete: false,
    writable: [
      "page",
      "path",
      "metaTitle",
      "metaDescription",
      "keywords",
      "canonicalUrl",
      "ogImage",
      "robots",
    ],
    nullableBlanks: ["canonicalUrl", "ogImage"],
  },
};

export function getResource(slug: string | undefined): ResourceConfig | null {
  if (!slug) return null;
  return RESOURCES[slug] ?? null;
}

/** The Prisma delegate for a resource (typed loosely — model is dynamic). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function delegate(cfg: ResourceConfig): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[cfg.model];
}

/** Build the Prisma `where` from search, filters and soft-delete state. */
export function buildWhere(
  cfg: ResourceConfig,
  sp: URLSearchParams
): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  if (cfg.softDelete) where.deletedAt = null;

  const search = sp.get("search")?.trim();
  if (search) {
    where.OR = cfg.searchable.map((f) => ({
      [f]: { contains: search, mode: "insensitive" },
    }));
  }

  for (const [param, filter] of Object.entries(cfg.filters ?? {})) {
    const raw = sp.get(param);
    if (raw == null || raw === "") continue;
    if (filter.kind === "boolean") {
      if (raw === "true" || raw === "false") where[param] = raw === "true";
    } else if (filter.kind === "enum") {
      if (filter.values.includes(raw)) where[param] = raw;
    } else {
      where[param] = raw;
    }
  }
  return where;
}

/** Pick + coerce the writable fields from a request body. */
export function pickWritable(
  cfg: ResourceConfig,
  body: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of cfg.writable) {
    if (!(key in body)) continue;
    let value = body[key];

    if (
      value === "" &&
      cfg.nullableBlanks?.includes(key)
    ) {
      out[key] = null;
      continue;
    }

    const coerce = cfg.coerce?.[key];
    if (coerce && value != null && value !== "") {
      if (coerce === "int") {
        const n = parseInt(String(value), 10);
        value = Number.isFinite(n) ? n : undefined;
      } else if (coerce === "float") {
        const n = parseFloat(String(value));
        value = Number.isFinite(n) ? n : undefined;
      } else if (coerce === "date") {
        const d = new Date(String(value));
        value = isNaN(d.getTime()) ? undefined : d;
      }
    }

    if (value !== undefined) out[key] = value;
  }
  return cfg.onWrite ? cfg.onWrite(out) : out;
}

export function shape(cfg: ResourceConfig, row: unknown): unknown {
  if (row == null) return row;
  return cfg.transform
    ? cfg.transform(row as Record<string, unknown>)
    : row;
}

function blankNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

/**
 * Normalise an inbound `seo` object (per-entity override). `keywords` may arrive
 * as an array or a comma-separated string. Returns null when every field is
 * empty, signalling "no override" so the public site falls back to content.
 */
export function seoFields(
  seo: unknown
): Record<string, unknown> | null {
  if (!seo || typeof seo !== "object") return null;
  const s = seo as Record<string, unknown>;

  const keywords = Array.isArray(s.keywords)
    ? (s.keywords as unknown[]).map(String).map((k) => k.trim()).filter(Boolean)
    : typeof s.keywords === "string"
      ? s.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

  const fields = {
    metaTitle: blankNull(s.metaTitle),
    metaDescription: blankNull(s.metaDescription),
    canonicalUrl: blankNull(s.canonicalUrl),
    ogImage: blankNull(s.ogImage),
    keywords,
    robots: ROBOTS_VALUES.includes(s.robots as (typeof ROBOTS_VALUES)[number])
      ? (s.robots as string)
      : "INDEX_FOLLOW",
  };

  const hasContent =
    fields.metaTitle ||
    fields.metaDescription ||
    fields.canonicalUrl ||
    fields.ogImage ||
    fields.keywords.length > 0;

  return hasContent ? fields : null;
}

/** Build the nested Prisma `seo` write for a create or update. */
export function seoNestedWrite(
  seo: unknown,
  mode: "create" | "update"
): Record<string, unknown> | undefined {
  const fields = seoFields(seo);
  if (!fields) return undefined;
  return mode === "create"
    ? { create: fields }
    : { upsert: { create: fields, update: fields } };
}

/**
 * Build nested Prisma writes for a resource's implicit m2m relations from the
 * request body. `connect` on create, `set` (full replace) on update. A field
 * absent from the body is skipped so partial updates don't wipe the relation.
 */
export function relationWrites(
  cfg: ResourceConfig,
  body: Record<string, unknown>,
  mode: "create" | "update"
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [relation, field] of Object.entries(cfg.relations ?? {})) {
    if (!(field in body)) continue;
    const ids = Array.isArray(body[field])
      ? (body[field] as unknown[]).filter((v): v is string => typeof v === "string")
      : [];
    const refs = ids.map((id) => ({ id }));
    out[relation] = mode === "create" ? { connect: refs } : { set: refs };
  }
  return out;
}
