# Project Requirements Document

## 1. Project Overview

The School Management Application is a web-based system built to help educational institutions digitize and streamline daily tasks like attendance tracking, teacher journaling, and administrative data management. It serves two main user types—**Teachers** and **TU/Admin staff**—on one shared codebase (a “monorepo”) powered by React on the frontend and Firebase on the backend. Teachers can log into a personalized dashboard to capture student attendance photos, mark attendance statuses (present, sick, absent), and write daily journal entries about class activities. Meanwhile, admins use a data-table interface to manage teachers, students, classes, and schedules.

This app addresses the inefficiencies of paper-based record keeping by providing a centralized, real-time solution. Key objectives include reducing manual errors, speeding up data entry, and giving stakeholders instant access to the latest attendance and journal records. Success criteria are measured by user adoption among teaching staff and admins, system uptime of at least 99.5%, average page-load times under 2 seconds, and zero critical data integrity issues during core operations like attendance capture and journal submission.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1.0)**
- User authentication (email/password) for Teachers and TU/Admin using Firebase Authentication.
- Role-based access control (RBAC) via Firebase Custom Claims or a `role` field in Firestore.
- Teacher Dashboard:
  - View daily class schedule fetched from Firestore.
  - Teacher Attendance Camera: capture and upload student photos to Firebase Storage.
  - Student Attendance Form: mark each student’s status and save records to Firestore.
  - Teacher Journal Form: create and list daily journal entries in Firestore with theme, activities, and notes.
- TU/Admin Panel:
  - CRUD (Create, Read, Update, Delete) operations on Teachers, Students, Classes, and Schedules via a DataTable UI.
- Real-time data sync and caching using Firestore listeners and TanStack Query.
- Theming with Tailwind CSS and `shadcn/ui`: bright-blue primary palette plus selectable background options.
- Continuous integration and deployment (CI/CD) setup with GitHub Actions to build, test, and deploy to a hosting provider (e.g., Vercel).

**Out-of-Scope (Phase 2+)**
- Native or hybrid mobile apps (React Native, Swift, Kotlin).
- Detailed analytics dashboards (charts, trend analysis).
- Offline mode or local data syncing.
- Push notifications or email/SMS alerts.
- Gradebook, exam scheduling, or report cards.

## 3. User Flow

**Teacher Journey:** A teacher lands on the login page and enters their email/password. Firebase Authentication validates credentials and fetches their role and profile from Firestore. They are redirected to the Teacher Dashboard, which displays today’s schedule using TanStack Query. To take attendance, they click a class, open the camera interface (`react-webcam`), capture student photos one by one, and submit. Each photo is uploaded to Firebase Storage, and a corresponding attendance record with timestamp is saved in Firestore. After attendance, the teacher clicks “Add Journal Entry,” fills out the form (theme, activities, notes) validated by Zod, and submits. The new journal appears in the chronological list below.

**Admin Journey:** An admin logs in via the same entry point but sees the Admin Panel after role detection. The panel displays DataTables (powered by `shadcn/ui`) for Teachers, Students, Classes, and Schedules. Admins can click “Add” or “Edit” to open modal dialogs with React Hook Form and Zod validation. On form submission, data is written to Firestore and the tables refresh automatically. When scheduling classes, admins select a teacher, subject, and student cohort, then save. These schedules immediately become available on teacher dashboards.

## 4. Core Features

- **Authentication & RBAC**: Secure login for Teachers and Admin, role checks for protected routes and UI.
- **Teacher Dashboard**: Daily schedule view, attendance and journal entry modules.
- **Attendance Camera**: Photo capture component integrated with Firebase Storage.
- **Student Attendance Form**: Mark present/sick/absent statuses, save to Firestore.
- **Teacher Journal Form**: Validated fields (theme, activities, notes) with React Hook Form + Zod.
- **Admin Data Management**: CRUD DataTables and modal dialogs for core entities (Teachers, Students, Classes, Schedules).
- **Scheduling Module**: Link teachers to classes and subjects, store in Firestore.
- **Theming & Customization**: Bright-blue color scheme and user-selectable backgrounds via Tailwind CSS.
- **Real-Time Sync & Caching**: Firestore listeners for live updates and TanStack Query for fetch/caching.
- **CI/CD Pipeline**: Automated builds, tests (Vitest, React Testing Library), and deploy via GitHub Actions.

## 5. Tech Stack & Tools

- **Frontend**: React 18, TypeScript, Vite (build tool).
- **Styling & UI**: Tailwind CSS, `shadcn/ui` component library.
- **Data Fetching & State**: TanStack Query (caching), React Hook Form (forms), Zod (validation).
- **Backend & BaaS**: Firebase Authentication, Firestore (NoSQL database), Firebase Storage (file uploads).
- **Testing**: Vitest (unit tests), React Testing Library (component tests).
- **CI/CD**: GitHub Actions (build, lint, test, deploy).
- **IDE Plugins**: VS Code with ESLint, Prettier, TypeScript IntelliSense.

## 6. Non-Functional Requirements

- **Performance**: All pages should load in under 2 seconds on average; attendance capture end-to-end under 1 second (after camera capture).
- **Reliability**: 99.5% uptime SLA for core features; graceful fallbacks when network connectivity is poor.
- **Security**: TLS/HTTPS for all traffic; Firebase Security Rules to enforce RBAC; password policies via Firebase Auth; sanitize all user inputs.
- **Accessibility**: Meet WCAG 2.1 AA standards (keyboard navigability, screen-reader labels).
- **Usability**: Clear form validation errors, loading spinners or skeletons during data fetch, consistent UI patterns.
- **Scalability**: Efficient Firestore reads/writes with query caching; anticipate up to 1,000 concurrent users.

## 7. Constraints & Assumptions

- **Firebase Account**: Project depends on a valid Firebase project with Auth, Firestore, and Storage enabled.
- **Browser Support**: Latest Chrome, Firefox, Edge, and Safari; must support camera API (`MediaDevices.getUserMedia`).
- **Internet Connectivity**: Users require stable internet; no offline support in v1.
- **Data Model**: Assumes predefined Firestore collections: `users`, `students`, `teachers`, `classes`, `schedules`, `studentAttendance`, `teacherJournals`.
- **Roles**: Assumes two roles only—`teacher` and `admin`.

## 8. Known Issues & Potential Pitfalls

- **API Limits & Costs**: Firestore has read/write quotas; mitigate by batching writes for attendance and caching reads.
- **Network Latency**: Real-time updates may lag on slow connections; use optimistic UI updates and show loading indicators.
- **Camera Permissions**: Browser prompts for camera access can interrupt flow; provide clear instructions and fallback if denied.
- **Storage Growth**: Accumulating attendance photos may inflate Storage costs; consider lifecycle rules to archive or delete old photos.
- **Role Change Propagation**: Changing a user’s role won’t immediately update client-side cache; clear TanStack Query cache on login event.
- **Data Integrity**: Concurrent edits in Admin Panel could lead to conflicts; use Firestore transactions for critical updates.

---
*End of Project Requirements Document*