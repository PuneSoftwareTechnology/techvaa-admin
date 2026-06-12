/**
 * Database seed — courses with their key-curriculum, upcoming batches, FAQs
 * and SEO metadata, plus a set of homepage FAQs.
 *
 * Idempotent: courses are upserted by id; each course's curriculum/batches are
 * replaced on every run; seeded FAQs (id-prefixed `faq_seed_…`) and SEO rows
 * are upserted. Safe to run repeatedly.
 *
 * Run:  npx prisma db seed   (wired via prisma.config.ts)
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE;
if (!connectionString) {
  throw new Error("Missing DATABASE connection string in environment");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const DAY = 86_400_000;
const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * DAY);
const daysAhead = (d: number) => new Date(now + d * DAY);
const img = (seed: string) => `https://picsum.photos/seed/${seed}/640/400`;

type CourseSeed = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  duration: string;
  image: string;
  isFeatured: boolean;
  isPublished: boolean;
  related: string[];
  curriculum: { heading: string; description: string; order: number }[];
  batches: {
    startDate: Date;
    duration: string;
    isOpen: boolean;
    showOnHomepage?: boolean;
  }[];
  faqs: { question: string; answer: string }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
  };
};

const COURSES: CourseSeed[] = [
  {
    id: "crs_fico",
    title: "SAP FICO (Financial Accounting & Controlling)",
    slug: "sap-fico",
    shortDescription:
      "Master financial accounting and controlling in SAP S/4HANA with hands-on labs.",
    description:
      "Comprehensive SAP FICO training covering GL, AP, AR, asset accounting, cost centre and profit centre accounting with hands-on S/4HANA practice.",
    duration: "8 weeks",
    image: img("sap-fico"),
    isFeatured: true,
    isPublished: true,
    related: ["crs_mm", "crs_sd"],
    curriculum: [
      { heading: "General Ledger (GL) Accounting", description: "Chart of accounts, document types, posting keys and the new G/L in S/4HANA.", order: 1 },
      { heading: "Accounts Payable & Receivable", description: "Vendor and customer master data, invoice and payment processing, dunning.", order: 2 },
      { heading: "Asset Accounting", description: "Asset master records, depreciation areas and period-end asset processes.", order: 3 },
      { heading: "Controlling (CO)", description: "Cost centre and profit centre accounting, internal orders and reporting.", order: 4 },
    ],
    batches: [
      { startDate: daysAhead(14), duration: "8 weeks", isOpen: true, showOnHomepage: true },
      { startDate: daysAhead(45), duration: "8 weeks", isOpen: true },
    ],
    faqs: [
      { question: "Do I need an accounting background for SAP FICO?", answer: "Basic familiarity with accounting concepts helps, but the course starts from fundamentals so commerce graduates and working professionals can both follow along." },
      { question: "Will I get hands-on access to an S/4HANA system?", answer: "Yes. Every module includes guided configuration and posting exercises on a live S/4HANA practice server." },
      { question: "Is this course aligned with SAP certification?", answer: "The curriculum maps to the C_TS4FI certification objectives and we provide a mock-test set before the exam." },
    ],
    seo: {
      metaTitle: "SAP FICO Training in S/4HANA | Techvaa",
      metaDescription: "Job-oriented SAP FICO course covering GL, AP, AR, asset accounting and controlling with hands-on S/4HANA labs and certification prep.",
      keywords: ["SAP FICO", "SAP FICO training", "S/4HANA finance", "SAP controlling", "SAP FI certification"],
    },
  },
  {
    id: "crs_mm",
    title: "SAP MM (Materials Management)",
    slug: "sap-mm",
    shortDescription: "End-to-end procurement, inventory and invoice verification in SAP MM.",
    description:
      "End-to-end procurement, inventory, and invoice verification processes in SAP MM with real configuration exercises.",
    duration: "6 weeks",
    image: img("sap-mm"),
    isFeatured: true,
    isPublished: true,
    related: ["crs_sd"],
    curriculum: [
      { heading: "Procurement Process", description: "Purchase requisitions, RFQs, purchase orders and the P2P cycle.", order: 1 },
      { heading: "Inventory Management", description: "Goods movements, stock types and physical inventory.", order: 2 },
      { heading: "Invoice Verification", description: "Logistics invoice verification and the three-way match.", order: 3 },
    ],
    batches: [
      { startDate: daysAhead(21), duration: "6 weeks", isOpen: true, showOnHomepage: true },
    ],
    faqs: [
      { question: "What roles can I target after SAP MM?", answer: "Graduates typically move into SAP MM consultant, procurement analyst and supply-chain support roles." },
      { question: "Does the course cover integration with FICO and SD?", answer: "Yes. We cover the procure-to-pay integration points with FICO (invoice posting) and SD (stock transfer) so you understand the end-to-end flow." },
      { question: "Are real configuration exercises included?", answer: "Every topic ends with a configuration task in IMG so you build muscle memory, not just theory." },
    ],
    seo: {
      metaTitle: "SAP MM Training — Procurement & Inventory | Techvaa",
      metaDescription: "Learn end-to-end SAP MM: procurement, inventory management and invoice verification with real configuration exercises and project work.",
      keywords: ["SAP MM", "SAP MM training", "SAP materials management", "procure to pay", "SAP MM certification"],
    },
  },
  {
    id: "crs_abap",
    title: "SAP ABAP Development",
    slug: "sap-abap",
    shortDescription: "Build custom SAP applications with ABAP — reports, BAPIs, OData and more.",
    description:
      "Learn ABAP programming, reports, ALV, BAPIs, BADIs, enhancements and OData services for SAP development roles.",
    duration: "10 weeks",
    image: img("sap-abap"),
    isFeatured: true,
    isPublished: true,
    related: [],
    curriculum: [
      { heading: "ABAP Fundamentals", description: "Data types, internal tables, control structures and the ABAP Dictionary.", order: 1 },
      { heading: "Reports & ALV", description: "Classical and interactive reports, ALV grid and list output.", order: 2 },
      { heading: "BAPIs, BADIs & Enhancements", description: "Enhancement framework, user exits, BADIs and remote-enabled BAPIs.", order: 3 },
      { heading: "OData & RAP", description: "Building OData services and an intro to the ABAP RESTful Application Model.", order: 4 },
    ],
    batches: [
      { startDate: daysAhead(7), duration: "10 weeks", isOpen: false },
      { startDate: daysAhead(60), duration: "10 weeks", isOpen: true },
    ],
    faqs: [
      { question: "Is prior programming experience required for ABAP?", answer: "No. We begin with programming basics, so freshers and functional consultants moving into technical roles can both start here." },
      { question: "Does this cover modern ABAP (OData and RAP)?", answer: "Yes. Alongside classic reports and enhancements, you'll build OData services and an introduction to the ABAP RESTful Application Model." },
      { question: "Will I build a real project?", answer: "You complete a capstone that ties together reports, a BAPI and an OData service to mirror a real development assignment." },
    ],
    seo: {
      metaTitle: "SAP ABAP Development Course | Techvaa",
      metaDescription: "Become an SAP ABAP developer — reports, ALV, BAPIs, BADIs, enhancements, OData and RAP with a hands-on capstone project.",
      keywords: ["SAP ABAP", "ABAP training", "SAP development", "OData", "ABAP RAP"],
    },
  },
  {
    id: "crs_sd",
    title: "SAP SD (Sales & Distribution)",
    slug: "sap-sd",
    shortDescription: "Own the order-to-cash cycle — pricing, billing and shipping in SAP SD.",
    description: "Master the order-to-cash cycle, pricing, billing and shipping in SAP SD.",
    duration: "6 weeks",
    image: img("sap-sd"),
    isFeatured: false,
    isPublished: true,
    related: ["crs_mm"],
    curriculum: [
      { heading: "Order Management", description: "Sales document types, item categories and schedule lines.", order: 1 },
      { heading: "Pricing", description: "Condition technique, pricing procedures and access sequences.", order: 2 },
      { heading: "Billing & Shipping", description: "Deliveries, picking, goods issue and billing documents.", order: 3 },
    ],
    batches: [
      { startDate: daysAhead(30), duration: "6 weeks", isOpen: true },
    ],
    faqs: [
      { question: "What is the order-to-cash cycle in SAP SD?", answer: "It's the flow from sales order to delivery, billing and payment. The course walks through each step with live document creation." },
      { question: "Does SAP SD pair well with SAP MM?", answer: "Yes — many consultants learn both to cover the full logistics chain. We highlight the MM-SD integration touchpoints throughout." },
    ],
    seo: {
      metaTitle: "SAP SD Training — Sales & Distribution | Techvaa",
      metaDescription: "Master the SAP SD order-to-cash cycle: pricing, billing and shipping with real document processing and integration scenarios.",
      keywords: ["SAP SD", "SAP SD training", "sales and distribution", "order to cash", "SAP SD certification"],
    },
  },
  {
    id: "crs_hana",
    title: "SAP S/4HANA Foundation",
    slug: "sap-s4hana-foundation",
    shortDescription: "Get started with the SAP S/4HANA suite, Fiori and core business processes.",
    description:
      "A foundational overview of SAP S/4HANA architecture, Fiori, and core business processes for all levels.",
    duration: "4 weeks",
    image: img("sap-hana"),
    isFeatured: false,
    isPublished: true,
    related: [],
    curriculum: [
      { heading: "S/4HANA Architecture", description: "In-memory computing, the universal journal and the simplified data model.", order: 1 },
      { heading: "SAP Fiori", description: "Fiori launchpad, app types and the user experience.", order: 2 },
      { heading: "Core Business Processes", description: "An overview of finance, procurement and sales in S/4HANA.", order: 3 },
    ],
    batches: [],
    faqs: [
      { question: "Is this course suitable for beginners?", answer: "Absolutely. It's a foundational overview designed for anyone new to SAP, including students and professionals exploring an SAP career." },
      { question: "Should I take this before a module course?", answer: "We recommend it as a primer before specialising in FICO, MM, SD or any other module — it gives you the big picture first." },
    ],
    seo: {
      metaTitle: "SAP S/4HANA Foundation Course | Techvaa",
      metaDescription: "A beginner-friendly introduction to SAP S/4HANA architecture, Fiori and core business processes — the ideal first step into SAP.",
      keywords: ["SAP S/4HANA", "S/4HANA foundation", "SAP Fiori", "SAP basics", "SAP for beginners"],
    },
  },
  {
    id: "crs_basis",
    title: "SAP BASIS Administration",
    slug: "sap-basis",
    shortDescription: "Administer and maintain SAP systems — transports, roles and tuning.",
    description:
      "System administration, transport management, user roles and performance tuning for SAP BASIS consultants.",
    duration: "8 weeks",
    image: img("sap-basis"),
    isFeatured: false,
    isPublished: false,
    related: [],
    curriculum: [],
    batches: [],
    faqs: [
      { question: "What does an SAP BASIS administrator do?", answer: "BASIS admins install, configure, monitor and tune SAP systems, manage transports and handle user roles and security." },
      { question: "Is BASIS a technical or functional role?", answer: "It's a technical/infrastructure role, ideal for those with a systems or networking interest rather than business-process focus." },
    ],
    seo: {
      metaTitle: "SAP BASIS Administration Training | Techvaa",
      metaDescription: "Learn SAP BASIS: system administration, transport management, user roles and performance tuning for SAP infrastructure roles.",
      keywords: ["SAP BASIS", "SAP BASIS training", "SAP administration", "transport management", "SAP security"],
    },
  },
  {
    id: "crs_hr",
    title: "SAP SuccessFactors (HCM)",
    slug: "sap-successfactors",
    shortDescription:
      "Cloud HR with SAP SuccessFactors — Employee Central, recruiting and onboarding.",
    description:
      "Hands-on SAP SuccessFactors training across Employee Central, Recruiting, Onboarding and Performance & Goals modules.",
    duration: "7 weeks",
    image: img("sap-successfactors"),
    isFeatured: true,
    isPublished: true,
    related: ["crs_fico"],
    curriculum: [
      { heading: "Employee Central", description: "Foundation objects, employee data and business rules.", order: 1 },
      { heading: "Recruiting & Onboarding", description: "Requisitions, candidate pipelines and onboarding workflows.", order: 2 },
    ],
    batches: [
      { startDate: daysAhead(18), duration: "7 weeks", isOpen: true },
    ],
    faqs: [
      { question: "Which SuccessFactors modules does the course cover?", answer: "Employee Central, Recruiting, Onboarding and Performance & Goals, with hands-on instance configuration for each." },
      { question: "Do I get access to a SuccessFactors instance?", answer: "Yes, you practise on a provisioned instance so you can configure foundation objects and business rules yourself." },
    ],
    seo: {
      metaTitle: "SAP SuccessFactors (HCM) Training | Techvaa",
      metaDescription: "Hands-on SAP SuccessFactors course across Employee Central, Recruiting, Onboarding and Performance & Goals — cloud HR skills employers want.",
      keywords: ["SAP SuccessFactors", "SuccessFactors training", "SAP HCM", "Employee Central", "cloud HR"],
    },
  },
  {
    id: "crs_ariba",
    title: "SAP Ariba",
    slug: "sap-ariba",
    shortDescription: "Source-to-pay and supplier management on the SAP Ariba network.",
    description:
      "Learn source-to-pay, procurement, contract management and supplier collaboration on the SAP Ariba cloud platform.",
    duration: "5 weeks",
    image: img("sap-ariba"),
    isFeatured: false,
    isPublished: true,
    related: ["crs_mm"],
    curriculum: [
      { heading: "Sourcing & Contracts", description: "Sourcing events, RFx and contract workspaces.", order: 1 },
      { heading: "Procurement & Invoicing", description: "Guided buying, purchase orders and invoice reconciliation.", order: 2 },
    ],
    batches: [],
    faqs: [
      { question: "How is SAP Ariba different from SAP MM?", answer: "Ariba is SAP's cloud source-to-pay and supplier-network platform, while MM is the on-premise materials module. Many procurement teams use both." },
      { question: "Is SAP Ariba in demand?", answer: "Yes, as organisations move procurement to the cloud, Ariba skills are increasingly sought after for source-to-pay roles." },
    ],
    seo: {
      metaTitle: "SAP Ariba Training — Source-to-Pay | Techvaa",
      metaDescription: "Learn SAP Ariba source-to-pay, contract management and supplier collaboration on the cloud procurement network with guided exercises.",
      keywords: ["SAP Ariba", "Ariba training", "source to pay", "SAP procurement cloud", "supplier management"],
    },
  },
  {
    id: "crs_bw",
    title: "SAP BW/4HANA Analytics",
    slug: "sap-bw4hana",
    shortDescription: "Data warehousing and reporting with SAP BW/4HANA.",
    description:
      "Design data models, build extractors and deliver reporting with SAP BW/4HANA and embedded analytics.",
    duration: "9 weeks",
    image: img("sap-bw"),
    isFeatured: false,
    isPublished: false,
    related: ["crs_hana"],
    curriculum: [],
    batches: [],
    faqs: [
      { question: "What will I be able to build after SAP BW/4HANA?", answer: "You'll design data models, build extractors and deliver reporting and embedded analytics on the BW/4HANA platform." },
      { question: "Is SQL or data-modelling knowledge needed?", answer: "Basic data-modelling awareness helps, but the course teaches the BW-specific modelling approach from the ground up." },
    ],
    seo: {
      metaTitle: "SAP BW/4HANA Analytics Training | Techvaa",
      metaDescription: "Build data warehousing and reporting skills with SAP BW/4HANA — data models, extractors and embedded analytics for BI roles.",
      keywords: ["SAP BW/4HANA", "BW4HANA training", "SAP analytics", "data warehousing", "SAP BI"],
    },
  },
];

// Homepage FAQs — general questions not tied to a single course. Shown in the
// site's homepage FAQ section (showOnHomepage = true).
const HOMEPAGE_FAQS: { question: string; answer: string }[] = [
  { question: "Do you provide placement assistance?", answer: "Yes. We offer resume building, mock interviews and connect you with our hiring-partner network until you land a role." },
  { question: "Are the classes online or classroom?", answer: "We run both live online and classroom batches. You can switch modes between sessions if your schedule changes." },
  { question: "Will I receive a certificate after completion?", answer: "Every learner receives a Techvaa course-completion certificate, and we prepare you for the relevant official SAP certification." },
  { question: "Are EMI or instalment payment options available?", answer: "Yes, flexible instalment plans are available. Talk to our counsellors to pick a plan that suits you." },
  { question: "Do you offer a free demo session?", answer: "Absolutely — book a free demo class to meet the trainer and experience the teaching style before you enrol." },
];

async function main() {
  // 1. Upsert every course (without relations first so ids exist for connect).
  for (let i = 0; i < COURSES.length; i++) {
    const c = COURSES[i];
    const data = {
      title: c.title,
      slug: c.slug,
      shortDescription: c.shortDescription,
      description: c.description,
      duration: c.duration,
      image: c.image,
      isFeatured: c.isFeatured,
      isPublished: c.isPublished,
      createdAt: daysAgo(80 - i * 8),
    };
    await prisma.course.upsert({
      where: { id: c.id },
      create: { id: c.id, ...data },
      update: data,
    });
  }

  // 2. Connect curated related courses (self m2m).
  for (const c of COURSES) {
    await prisma.course.update({
      where: { id: c.id },
      data: { relatedCourses: { set: c.related.map((id) => ({ id })) } },
    });
  }

  // 3. Replace curriculum + batches for each course (idempotent).
  for (const c of COURSES) {
    await prisma.curriculumItem.deleteMany({ where: { courseId: c.id } });
    if (c.curriculum.length) {
      await prisma.curriculumItem.createMany({
        data: c.curriculum.map((item) => ({ ...item, courseId: c.id })),
      });
    }

    await prisma.courseBatch.deleteMany({ where: { courseId: c.id } });
    if (c.batches.length) {
      await prisma.courseBatch.createMany({
        data: c.batches.map((b) => ({ ...b, courseId: c.id })),
      });
    }
  }

  // 4. Per-course FAQs. Seeded FAQs use a stable `faq_seed_<courseId>_<n>` id so
  //    re-runs upsert in place instead of duplicating. Each is connected to its
  //    course via the CourseFaqs m2m relation.
  for (const c of COURSES) {
    for (let i = 0; i < c.faqs.length; i++) {
      const f = c.faqs[i];
      const id = `faq_seed_${c.id}_${i + 1}`;
      const data = {
        question: f.question,
        answer: f.answer,
        sortOrder: i + 1,
        isPublished: true,
        showOnHomepage: false,
        courses: { connect: { id: c.id } },
      };
      await prisma.faq.upsert({
        where: { id },
        create: { id, ...data },
        update: { ...data, courses: { set: [{ id: c.id }] } },
      });
    }
  }

  // 5. Homepage FAQs — general, not attached to any course.
  for (let i = 0; i < HOMEPAGE_FAQS.length; i++) {
    const f = HOMEPAGE_FAQS[i];
    const id = `faq_seed_home_${i + 1}`;
    const data = {
      question: f.question,
      answer: f.answer,
      sortOrder: i + 1,
      isPublished: true,
      showOnHomepage: true,
    };
    await prisma.faq.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  }

  // 6. Per-course SEO metadata (1:1, keyed by the unique courseId).
  for (const c of COURSES) {
    const data = {
      metaTitle: c.seo.metaTitle,
      metaDescription: c.seo.metaDescription,
      keywords: c.seo.keywords,
      ogTitle: c.seo.ogTitle ?? c.seo.metaTitle,
      ogDescription: c.seo.ogDescription ?? c.seo.metaDescription,
      ogImage: c.image,
      canonicalUrl: `https://techvaa.com/courses/${c.slug}`,
    };
    await prisma.seoMetadata.upsert({
      where: { courseId: c.id },
      create: { courseId: c.id, ...data },
      update: data,
    });
  }

  const [courses, items, batches, faqs, seo] = await Promise.all([
    prisma.course.count(),
    prisma.curriculumItem.count(),
    prisma.courseBatch.count(),
    prisma.faq.count(),
    prisma.seoMetadata.count(),
  ]);
  console.log(
    `Seeded: ${courses} courses, ${items} curriculum items, ${batches} batches, ${faqs} FAQs, ${seo} SEO records.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
