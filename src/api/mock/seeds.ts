import type {
  Blog,
  Course,
  CourseEnquiry,
  Faq,
  Lead,
  Media,
  Placement,
  Review,
} from '@/types/domain'

/** Deterministic ISO date `days` ago (avoids per-render churn). */
const base = Date.UTC(2026, 4, 1) // 2026-05-01
function daysAgo(days: number): string {
  return new Date(base - days * 86_400_000).toISOString()
}

export const COURSE_SEED: Course[] = [
  { id: 'crs_fico', title: 'SAP FICO (Financial Accounting & Controlling)', slug: 'sap-fico', description: 'Comprehensive SAP FICO training covering GL, AP, AR, asset accounting, cost centre and profit centre accounting with hands-on S/4HANA practice.', intro: ['Master financial accounting and controlling in SAP S/4HANA', 'Hands-on practice on a live S/4HANA environment'], modules: ['General Ledger (GL)', 'Accounts Payable & Receivable', 'Asset Accounting', 'Cost & Profit Centre Accounting'], prerequisites: ['Basic accounting knowledge'], relatedCourseIds: ['crs_mm', 'crs_sd'], image: null, isFeatured: true, isPublished: true, createdAt: daysAgo(80), updatedAt: daysAgo(5) },
  { id: 'crs_mm', title: 'SAP MM (Materials Management)', slug: 'sap-mm', description: 'End-to-end procurement, inventory, and invoice verification processes in SAP MM with real configuration exercises.', intro: ['Procurement and inventory management in SAP'], modules: ['Procurement Process', 'Inventory Management', 'Invoice Verification'], prerequisites: [], relatedCourseIds: ['crs_sd'], image: null, isFeatured: true, isPublished: true, createdAt: daysAgo(75), updatedAt: daysAgo(8) },
  { id: 'crs_abap', title: 'SAP ABAP Development', slug: 'sap-abap', description: 'Learn ABAP programming, reports, ALV, BAPIs, BADIs, enhancements and OData services for SAP development roles.', intro: ['Build custom SAP applications with ABAP'], modules: ['ABAP Basics', 'Reports & ALV', 'BAPIs & BADIs', 'OData Services'], prerequisites: ['Any programming background'], relatedCourseIds: [], image: null, isFeatured: true, isPublished: true, createdAt: daysAgo(70), updatedAt: daysAgo(12) },
  { id: 'crs_sd', title: 'SAP SD (Sales & Distribution)', slug: 'sap-sd', description: 'Master the order-to-cash cycle, pricing, billing and shipping in SAP SD.', intro: ['Order-to-cash processes in SAP'], modules: ['Order Management', 'Pricing', 'Billing & Shipping'], prerequisites: [], relatedCourseIds: ['crs_mm'], image: null, isFeatured: false, isPublished: true, createdAt: daysAgo(60), updatedAt: daysAgo(15) },
  { id: 'crs_hana', title: 'SAP S/4HANA Foundation', slug: 'sap-s4hana-foundation', description: 'A foundational overview of SAP S/4HANA architecture, Fiori, and core business processes for all levels.', intro: ['Get started with the SAP S/4HANA suite'], modules: ['S/4HANA Architecture', 'SAP Fiori', 'Core Business Processes'], prerequisites: [], relatedCourseIds: [], image: null, isFeatured: false, isPublished: true, createdAt: daysAgo(45), updatedAt: daysAgo(9) },
  { id: 'crs_basis', title: 'SAP BASIS Administration', slug: 'sap-basis', description: 'System administration, transport management, user roles and performance tuning for SAP BASIS consultants.', intro: ['Administer and maintain SAP systems'], modules: ['System Administration', 'Transport Management', 'User Roles', 'Performance Tuning'], prerequisites: ['Basic OS and networking knowledge'], relatedCourseIds: [], image: null, isFeatured: false, isPublished: false, createdAt: daysAgo(20), updatedAt: daysAgo(2) },
]

export const BLOG_SEED: Blog[] = [
  { id: 'blg_fico_career', title: 'Why SAP FICO is the Highest-Paying SAP Module in 2026', slug: 'sap-fico-highest-paying-2026', metaDescription: 'A look at salary trends and demand for SAP FICO consultants.', featuredImage: null, introduction: 'SAP FICO continues to dominate the SAP job market, and salaries keep climbing.', primaryTitle: 'The demand picture', primaryText: 'Across consulting firms and product companies, FICO roles remain the hardest to fill...', tertiaryPoints: [], conclusion: 'For 2026, FICO remains the safest bet for a high-paying SAP career.', showOnHomepage: true, isPublished: true, publishedAt: daysAgo(14), relatedCourseId: 'crs_fico', createdAt: daysAgo(16), updatedAt: daysAgo(14) },
  { id: 'blg_abap_vs', title: 'ABAP vs Functional: Which SAP Career Path Should You Choose?', slug: 'abap-vs-functional-sap-career', metaDescription: 'Technical or functional? We break down both SAP career tracks.', featuredImage: null, introduction: 'Choosing between a technical and functional SAP career shapes the next decade of your work.', primaryTitle: 'The functional track', primaryText: 'Functional consultants own business processes in modules like FICO, MM and SD...', secondaryTitle: 'The technical track', secondaryText: 'ABAP developers build and extend the system itself...', tertiaryPoints: [], showOnHomepage: false, isPublished: true, publishedAt: daysAgo(28), relatedCourseId: 'crs_abap', createdAt: daysAgo(30), updatedAt: daysAgo(28) },
  { id: 'blg_interview', title: '15 SAP Interview Questions Every Fresher Must Prepare', slug: 'sap-interview-questions-freshers', metaDescription: 'Crack your first SAP interview with these essentials.', featuredImage: null, introduction: 'Walking into your first SAP interview is far less daunting once you know what to expect.', tertiaryTitle: 'Must-prepare questions', tertiaryPoints: ['What is an SAP client?', 'Explain the ASAP methodology.', 'What is a transport request?'], showOnHomepage: false, isPublished: false, publishedAt: null, relatedCourseId: null, createdAt: daysAgo(6), updatedAt: daysAgo(1) },
]

export const REVIEW_SEED: Review[] = [
  { id: 'rev_1', studentName: 'Ananya Sharma', company: 'Accenture', designation: 'SAP FICO Consultant', rating: 5, review: 'Techvaa transformed my career. The hands-on S/4HANA labs made all the difference in my interviews.', image: null, isPublished: true, createdAt: daysAgo(40), updatedAt: daysAgo(40) },
  { id: 'rev_2', studentName: 'Rahul Verma', company: 'Infosys', designation: 'SAP ABAP Developer', rating: 5, review: 'Best SAP training institute. The trainers are real-world consultants who teach what the industry actually needs.', image: null, isPublished: true, createdAt: daysAgo(35), updatedAt: daysAgo(35) },
  { id: 'rev_3', studentName: 'Priya Nair', company: 'TCS', designation: 'SAP MM Analyst', rating: 4, review: 'Great curriculum and placement support. Got placed within 2 months of finishing the course.', image: null, isPublished: true, createdAt: daysAgo(22), updatedAt: daysAgo(22) },
  { id: 'rev_4', studentName: 'Mohammed Irfan', company: 'Capgemini', designation: 'SAP SD Consultant', rating: 5, review: 'The mock interviews and resume guidance were incredibly valuable. Highly recommend Techvaa.', image: null, isPublished: false, createdAt: daysAgo(4), updatedAt: daysAgo(4) },
]

export const PLACEMENT_SEED: Placement[] = [
  { id: 'plc_1', studentName: 'Ananya Sharma', company: 'Accenture', package: '12 LPA', course: 'SAP FICO', image: null, linkedinUrl: 'https://linkedin.com/in/ananya', joiningDate: daysAgo(38), isPublished: true, createdAt: daysAgo(39), updatedAt: daysAgo(38) },
  { id: 'plc_2', studentName: 'Rahul Verma', company: 'Infosys', package: '10.5 LPA', course: 'SAP ABAP', image: null, linkedinUrl: 'https://linkedin.com/in/rahulv', joiningDate: daysAgo(33), isPublished: true, createdAt: daysAgo(34), updatedAt: daysAgo(33) },
  { id: 'plc_3', studentName: 'Priya Nair', company: 'TCS', package: '9 LPA', course: 'SAP MM', image: null, linkedinUrl: null, joiningDate: daysAgo(20), isPublished: true, createdAt: daysAgo(21), updatedAt: daysAgo(20) },
  { id: 'plc_4', studentName: 'Karan Mehta', company: 'Deloitte', package: '14 LPA', course: 'SAP FICO', image: null, linkedinUrl: 'https://linkedin.com/in/karanm', joiningDate: daysAgo(12), isPublished: true, createdAt: daysAgo(13), updatedAt: daysAgo(12) },
]

export const FAQ_SEED: Faq[] = [
  { id: 'faq_1', question: 'Do I need a technical background to learn SAP?', answer: 'No. Functional modules like FICO, MM and SD are well-suited to candidates from commerce, business and engineering backgrounds alike.', sortOrder: 1, isPublished: true, showOnHomepage: true, courseIds: [], createdAt: daysAgo(100), updatedAt: daysAgo(50) },
  { id: 'faq_2', question: 'Does Techvaa provide placement assistance?', answer: 'Yes. We offer resume building, mock interviews and direct referrals to our 50+ hiring partners.', sortOrder: 2, isPublished: true, showOnHomepage: true, courseIds: [], createdAt: daysAgo(100), updatedAt: daysAgo(48) },
  { id: 'faq_3', question: 'Are the classes live or recorded?', answer: 'We offer instructor-led live sessions with lifetime access to recordings and a dedicated practice server.', sortOrder: 3, isPublished: true, showOnHomepage: false, courseIds: [], createdAt: daysAgo(95), updatedAt: daysAgo(45) },
  { id: 'faq_4', question: 'Will I get hands-on access to an SAP system?', answer: 'Absolutely. Every learner receives guided access to a live S/4HANA practice environment throughout the course.', sortOrder: 4, isPublished: true, showOnHomepage: false, courseIds: [], createdAt: daysAgo(90), updatedAt: daysAgo(40) },
]

export const LEAD_SEED: Lead[] = [
  { id: 'led_1', name: 'Sneha Patel', email: 'sneha.patel@gmail.com', phone: '+91 98765 43210', message: 'Interested in the SAP FICO weekend batch.', courseInterest: 'SAP FICO', status: 'NEW', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'led_2', name: 'Arjun Reddy', email: 'arjun.r@outlook.com', phone: '+91 90123 45678', message: 'What is the fee for SAP ABAP?', courseInterest: 'SAP ABAP', status: 'CONTACTED', createdAt: daysAgo(3), updatedAt: daysAgo(2) },
  { id: 'led_3', name: 'Divya Krishnan', email: 'divya.k@yahoo.com', phone: '+91 99887 76655', message: null, courseInterest: 'SAP MM', status: 'QUALIFIED', createdAt: daysAgo(5), updatedAt: daysAgo(4) },
  { id: 'led_4', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 88990 01122', message: 'Looking for corporate training.', courseInterest: 'SAP S/4HANA', status: 'CONTACTED', createdAt: daysAgo(7), updatedAt: daysAgo(6) },
  { id: 'led_5', name: 'Fatima Khan', email: 'fatima.k@gmail.com', phone: '+91 77665 54433', message: 'Do you offer EMI options?', courseInterest: 'SAP SD', status: 'NEW', createdAt: daysAgo(9), updatedAt: daysAgo(9) },
  { id: 'led_6', name: 'Rohan Das', email: 'rohan.das@gmail.com', phone: '+91 66554 43322', message: 'Already enrolled, thanks!', courseInterest: 'SAP FICO', status: 'CLOSED', createdAt: daysAgo(18), updatedAt: daysAgo(15) },
  { id: 'led_7', name: 'Meera Joshi', email: 'meera.j@gmail.com', phone: null, message: 'Decided to go with another institute.', courseInterest: 'SAP BASIS', status: 'LOST', createdAt: daysAgo(24), updatedAt: daysAgo(20) },
  { id: 'led_8', name: 'Aditya Kumar', email: 'aditya.k@gmail.com', phone: '+91 95555 12345', message: 'Weekend batch availability?', courseInterest: 'SAP ABAP', status: 'QUALIFIED', createdAt: daysAgo(11), updatedAt: daysAgo(10) },
]

export const COURSE_ENQUIRY_SEED: CourseEnquiry[] = [
  { id: 'enq_1', name: 'Harsh Agarwal', phone: '+91 98111 22334', course: 'SAP S/4HANA Finance (FICO)', message: 'Please confirm my seat for the Jul 1 batch.', status: 'NEW', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'enq_2', name: 'Sana Iqbal', phone: '+91 97222 33445', course: 'SAP MM (Materials Management)', message: 'Is the classroom batch in the morning slot?', status: 'NEW', createdAt: daysAgo(2), updatedAt: daysAgo(2) },
  { id: 'enq_3', name: 'Deepak Rao', phone: '+91 96333 44556', course: 'SAP ABAP (Programming)', message: null, status: 'CONTACTED', createdAt: daysAgo(4), updatedAt: daysAgo(3) },
  { id: 'enq_4', name: 'Lakshmi Menon', phone: '+91 95444 55667', course: 'SAP S/4HANA Sales (SD)', message: 'Do you offer EMI for the self-paced track?', status: 'QUALIFIED', createdAt: daysAgo(6), updatedAt: daysAgo(5) },
  { id: 'enq_5', name: 'Imran Sheikh', phone: '+91 94555 66778', course: 'SAP S/4HANA Finance (FICO)', message: 'Already paid the registration fee.', status: 'CLOSED', createdAt: daysAgo(12), updatedAt: daysAgo(10) },
]

export const MEDIA_SEED: Media[] = [
  { id: 'med_1', fileName: 'courses/fico-hero.webp', originalName: 'fico-hero.webp', fileType: 'image/webp', fileSize: 184_320, url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600', createdAt: daysAgo(30), uploadedById: 'usr_admin' },
  { id: 'med_2', fileName: 'blog/abap-cover.webp', originalName: 'abap-cover.webp', fileType: 'image/webp', fileSize: 220_160, url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', createdAt: daysAgo(22), uploadedById: 'usr_admin' },
  { id: 'med_3', fileName: 'placements/accenture.png', originalName: 'accenture-logo.png', fileType: 'image/png', fileSize: 48_128, url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600', createdAt: daysAgo(15), uploadedById: 'usr_admin' },
  { id: 'med_4', fileName: 'brochures/sap-catalog.pdf', originalName: 'sap-course-catalog.pdf', fileType: 'application/pdf', fileSize: 1_048_576, url: '#', createdAt: daysAgo(10), uploadedById: 'usr_admin' },
]
