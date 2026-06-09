You are a Principal Frontend Architect and Senior React Engineer.

Build a production-grade Admin Panel for the Techvaa platform.

Techvaa is an SAP Training Institute marketing website.

The Admin Panel will manage:

- Courses
- Blogs
- Blog Categories
- Reviews
- Placements
- FAQs
- Leads
- Media Uploads
- SEO Metadata

TECH STACK

- React 19
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios
- Prisma-backed APIs
- Neon PostgreSQL

ARCHITECTURE REQUIREMENTS

Follow:

- SOLID Principles
- Clean Architecture
- DRY
- KISS
- Separation of Concerns
- Feature-Based Modular Structure

Folder Structure:

src/
├── app/
├── modules/
│ ├── auth/
│ ├── dashboard/
│ ├── courses/
│ ├── blogs/
│ ├── categories/
│ ├── reviews/
│ ├── placements/
│ ├── faqs/
│ ├── leads/
│ ├── media/
│ ├── seo/
│ └── shared/
├── components/
├── services/
├── repositories/
├── hooks/
├── store/
├── providers/
├── layouts/
├── routes/
├── types/
├── validations/
├── constants/
├── utils/
└── lib/

STATE MANAGEMENT

Use TanStack Query for ALL server state.

Responsibilities:

- API calls
- Data fetching
- Mutations
- Pagination
- Search
- Filters
- Infinite scrolling
- Caching
- Optimistic updates
- Background refetching
- Retry handling

Use Zustand ONLY for:

- Sidebar state
- Theme state
- User session state
- Modal state
- UI preferences

Do NOT store API data inside Zustand.

SERVER COMMUNICATION

Use Axios.

Create:

services/
repositories/

Pattern:

UI
↓
Hooks
↓
Services
↓
Repositories
↓
API

Never call APIs directly inside components.

AUTHENTICATION

Single Admin Login System.

Features:

- Login
- Logout
- Session Validation
- Protected Routes
- Auto Logout
- Remember Me

Use:

- JWT
- HttpOnly Cookies

DASHBOARD

Create a professional dashboard.

Show:

- Total Leads
- Total Courses
- Total Blogs
- Total Placements
- Total Reviews

Charts:

- Monthly Leads
- Lead Sources
- Course Interest Analytics

Use Recharts.

COURSES MODULE

Features:

- Create Course
- Edit Course
- Delete Course
- Publish Course
- Search
- Filters
- Pagination

Fields:

- Title
- Slug
- Description
- Duration
- Level
- Featured Image
- SEO Metadata

BLOG MODULE

Features:

- Create Blog
- Edit Blog
- Delete Blog
- Preview Blog
- Publish Blog
- Rich Text Editor

Fields:

- Title
- Slug
- Excerpt
- Content
- Featured Image
- Category
- SEO Metadata

BLOG CATEGORY MODULE

Features:

- Create
- Edit
- Delete
- Search

REVIEWS MODULE

Features:

- Create
- Edit
- Delete
- Publish
- Ratings

PLACEMENTS MODULE

Features:

- Create
- Edit
- Delete
- Publish

Fields:

- Student Name
- Company
- Package
- LinkedIn URL
- Image

FAQ MODULE

Features:

- Create
- Edit
- Delete
- Sort Order
- Publish

LEADS MODULE

Features:

- Search
- Filters
- Status Update
- Export CSV
- Pagination

Statuses:

- New
- Contacted
- Qualified
- Closed
- Lost

MEDIA MODULE

Integrate AWS S3.

Features:

- Upload
- Delete
- Search
- Preview

Requirements:

- Drag and Drop
- File Validation
- Progress Indicator
- Image Preview

SEO MODULE

Manage:

- Meta Title
- Meta Description
- Keywords
- Canonical URL
- Open Graph Image
- Robots
- Structured Data

PERFORMANCE REQUIREMENTS

Target:

- Lighthouse 95+
- Fast Navigation
- Minimal Re-renders

Implement:

- TanStack Query Cache
- Lazy Loading
- Code Splitting
- Route-based Splitting
- Dynamic Imports
- Virtualized Tables
- Debounced Search
- Optimistic Updates

USER EXPERIENCE

Implement:

- Skeleton Loading
- Empty States
- Error States
- Success States
- Toast Notifications

ACCESSIBILITY

Implement:

- WCAG AA
- Keyboard Navigation
- Proper ARIA Labels
- Semantic HTML

UI REQUIREMENTS

Build:

- Responsive Sidebar
- Top Navigation
- Breadcrumbs
- Search Bar
- Data Tables
- Reusable Forms
- Reusable Modals

Use ShadCN components.

CODE QUALITY

Requirements:

- Strict TypeScript
- Reusable Hooks
- Reusable Table Component
- Reusable Form Component
- Reusable Modal Component
- DTO Pattern
- Type-safe APIs

DELIVERABLES

Generate:

1. Complete Project Structure
2. Routing Architecture
3. State Management Architecture
4. TanStack Query Setup
5. Zustand Setup
6. Authentication Flow
7. API Layer
8. Repository Layer
9. Reusable Components
10. Production-ready Admin Panel

The final result should feel like a premium SaaS dashboard and be maintainable for years while following SOLID principles and enterprise React best practices.
