# Frontend Guideline Document for School Management Application

This document provides a clear overview of the frontend architecture, design principles, and technologies used in the School Management Application built on the `school-monorepo-react-firebase` starter. It is written in everyday language to ensure anyone—even without a deep technical background—can understand how the frontend is organized and why certain decisions were made.

## 1. Frontend Architecture

### 1.1 Overall Structure
- Framework: React 18 provides a fast, component-based way to build our user interface.  
- Build Tool: Vite gives us instant startup and lightning-fast hot module replacement during development.  
- Language: TypeScript adds type safety, helping us catch bugs early and document our data models (like `Teacher`, `Student`, and `Schedule`).  
- UI Library: `shadcn/ui` supplies a set of unopinionated, accessible UI primitives (Buttons, Cards, DataTables, Dialogs) that we theme with Tailwind CSS.  
- Styling: Tailwind CSS offers utility-first classes so we can style elements quickly without leaving our markup.  
- State & Data: TanStack Query handles data fetching and caching; React Hook Form + Zod handle form state and validation.  
- Backend Integration: Firebase (Authentication, Firestore, Storage) acts as our backend-as-a-service, so we don’t have to write server code.

### 1.2 Scalability, Maintainability, Performance
- Modular Design: A feature-based folder structure keeps related code together (e.g., `features/attendance`, `features/journal`).  
- Reusable Components: UI primitives in `src/components/ui` and shared wrappers in `src/components/shared` prevent duplication.  
- Code Splitting: Vite automatically splits code by route, so users only download what they need.  
- Caching & Real-Time Updates: TanStack Query + Firestore listeners ensure data stays fresh without unnecessary network calls.

## 2. Design Principles

### 2.1 Usability
- Intuitive Layout: Teachers immediately see today’s schedule; admins get a clear data-table interface.  
- Minimal Steps: Forms auto-validate and guide users to correct mistakes before submission.

### 2.2 Accessibility
- Keyboard Navigation: Dialogs, forms, and tables are fully keyboard-navigable.  
- Screen-Reader Support: `aria-` attributes are used on interactive elements to announce labels and states.

### 2.3 Responsiveness
- Mobile-First: Layouts stack vertically on small screens; data tables collapse to cards.  
- Fluid Grids: Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`) adjust spacing and font sizes automatically.

## 3. Styling and Theming

### 3.1 Styling Approach
- Methodology: Utility-first (Tailwind CSS) avoids global CSS conflicts and encourages consistency.  
- Preprocessor: Not needed—Tailwind’s JIT mode generates only the classes we use.

### 3.2 Theming
- Primary Color: Bright blue (#3B82F6) for buttons, links, and active states.  
- Secondary Color: Sunny yellow (#FBBF24) for highlights and callouts.  
- Neutral Palette: Grays from light (#F3F4F6) to dark (#374151) for backgrounds and text.  
- Accent Colors: Green (#10B981) for success, red (#EF4444) for errors.  
- Background Options: Users can toggle between a simple solid background or a subtle patterned background via a global state.  

### 3.3 Style Tone
- Visual Style: Modern, flat design with occasional glassmorphism on cards (slightly translucent, softly blurred backgrounds) to evoke an approachable “school lounge” feel.  
- Typography: Inter font for a clean, readable look across headings and body text.

## 4. Component Structure

### 4.1 Organization
- `src/components/ui/`: Unstyled building blocks from `shadcn/ui` (Button, Input, DataTable, Dialog).  
- `src/components/shared/`: Styled, composed components (PageLayout, UserAvatar, Sidebar).  
- `src/features/[feature-name]/`: Feature-specific UIs (e.g., `attendance/TeacherAttendanceCamera`, `journal/JournalForm`).

### 4.2 Reuse and Maintainability
- Single Responsibility: Each component does one thing (e.g., a Table only renders data, it doesn’t handle fetching).  
- Props-Driven: Behaviour and styling are controlled via props, reducing the need for hardcoded logic.

## 5. State Management

### 5.1 Server State
- Handled by TanStack Query: Fetches data (schedules, attendance records, journal entries) and caches it.  
- Real-Time Listeners: Optional subscriptions to Firestore for live updates (e.g., when an admin edits a schedule).

### 5.2 Client State
- Local UI State: Managed by component state or React Context (e.g., theme selection).  
- Forms: React Hook Form manages form state; Zod enforces validation schemas.

## 6. Routing and Navigation

### 6.1 Routing Library
- React Router DOM: Defines routes and nested layouts.  
- Protected Routes: Custom wrappers check the user’s role (Teacher vs. Admin) before allowing access.

### 6.2 Navigation Structure
- Public Routes: Login and password reset pages.  
- Teacher Routes: Dashboard, Attendance, Journal.  
- Admin Routes: User Management, Class & Schedule Management, Reports.

## 7. Performance Optimization

- Code Splitting: Pages are lazy-loaded with React `lazy()` and `Suspense`.  
- Image Optimization: Firebase Storage serves compressed images; we request thumbnails where appropriate.  
- Tree Shaking: Vite and modern ES modules ensure unused code is dropped at build time.  
- Skeleton Screens & Spinners: Show placeholders while data loads to improve perceived speed.

## 8. Testing and Quality Assurance

### 8.1 Testing Strategy
- Unit Tests: Vitest + React Testing Library for individual components and hooks (e.g., `useAuth`, `useSchedule`).  
- Integration Tests: Verify that form components work end-to-end (fill, validate, submit).  
- End-to-End Tests: Optional Cypress tests for key flows (teacher login → take attendance → upload photo).

### 8.2 Linting & Formatting
- ESLint with TypeScript plugin enforces code style and catches common mistakes.  
- Prettier auto-formats code on save or pre-commit via Husky.

### 8.3 CI/CD
- GitHub Actions runs lint, tests, and builds on every pull request.  
- Successful builds deploy automatically to Vercel (for preview) or Netlify (production).

## 9. Conclusion and Overall Frontend Summary

This frontend setup combines the power of React 18, Vite, TypeScript, and Firebase with a modular, feature-based structure. A utility-first styling approach (Tailwind CSS + a bright blue theme) ensures consistent branding and quick UI iteration. Key libraries like TanStack Query, React Hook Form, and Zod streamline data fetching and form handling, while `shadcn/ui` provides accessible, composable primitives. Black-box services (Firebase Authentication, Firestore, Storage) handle our backend needs without extra server code.

Together, these guidelines form a clear blueprint for developing, scaling, and maintaining the School Management Application’s frontend—making it easy for new team members to jump in and deliver features that meet user needs and school branding requirements.