# Tech Stack Document for School Management Application

## Frontend Technologies

We chose a set of modern, easy-to-use tools to build the user interface that teachers and administrators will interact with daily.

- React 18 (with TypeScript)
  • A popular library for creating fast, interactive web pages. TypeScript ensures we catch errors early, keeping the app reliable.
- Vite
  • A lightning-fast build tool that makes development smooth and reloads the app instantly when you make changes.
- Tailwind CSS
  • A utility-first styling framework that lets us rapidly design a clean, bright blue school-branded interface without writing custom CSS from scratch.
- shadcn/ui component library
  • Pre-built, accessible UI building blocks (buttons, forms, cards, tables) that match our Tailwind theme and speed up development.
- Framer Motion
  • Simple animations and transitions to make interactions feel more engaging (for example, smooth modal dialogs or button feedback).
- React Router DOM
  • Handles navigation between pages (teacher dashboard, admin panel, login screens), enabling smooth, in-app page changes.
- TanStack Query
  • Efficient fetching and caching of data (like daily schedules or journal entries) so the app feels snappy and reduces repeated server requests.
- React Hook Form + Zod
  • A combination that gives us extremely efficient form handling (fast updates) plus strong validation rules (no invalid data gets saved).
- react-webcam
  • Provides a straightforward camera interface for teachers to capture attendance photos right from their browser.
- Vitest + React Testing Library
  • Tools for writing automated tests that verify critical functionality (forms, data loading, role-based views) to keep the app stable as it grows.

## Backend Technologies

The application uses Firebase, which means we don’t manage our own server. Instead, Firebase provides reliable services you can scale with.

- Firebase Authentication
  • Secure login system for both Teachers and TU/Admin users, with role flags to control who sees which screens.
- Firestore (Cloud Firestore)
  • A flexible, NoSQL database that stores all application data (users, classes, attendance records, journal entries) in real time.
- Firebase Storage
  • Stores and serves attendance photos securely. Teachers can upload images directly to the cloud without a custom file-server.

## Infrastructure and Deployment

We aim for a smooth developer workflow and reliable, continuous updates for the live app.

- Git + GitHub Monorepo
  • All code lives in one repository, allowing shared code and consistent dependencies for frontend and backend logic.
- GitHub Actions
  • Automated pipelines that build, test, and validate code on every push or pull request, preventing broken changes from reaching production.
- Hosting on Vercel or Netlify
  • Easy-to-configure platforms that automatically deploy the latest version when new code passes all checks. They handle SSL, global CDN, and scaling for us.

## Third-Party Integrations

While Firebase covers most backend needs, we also rely on a few external libraries to fill specific roles.

- react-webcam
  • Simplifies access to the device camera for capturing student photos during attendance.
- shadcn/ui
  • Although it lives in our codebase, it sources design patterns from community-maintained components to save time.

## Security and Performance Considerations

We want the app to be both safe for sensitive school data and fast for everyday use.

Security measures:
- Role-Based Access Control (RBAC)
  • We use Firebase Auth custom claims or a `role` field in Firestore to ensure only the right users can view or edit specific data.
- Firestore Security Rules
  • Server-side rules that enforce who can read or write which collections (for example, only admins can manage classes).
- Form Validation with Zod
  • Prevents invalid or malicious input from ever reaching the database.

Performance optimizations:
- Data Caching with TanStack Query
  • Minimizes repeated requests by caching recent data and only refetching when needed.
- Vite’s Code Splitting
  • Breaks the JavaScript bundle into smaller pieces so the browser only loads what’s needed for each page.
- Loading Indicators
  • Skeleton screens and spinners improve perceived speed when waiting for data.

## Conclusion and Overall Tech Stack Summary

By combining React, TypeScript, Tailwind CSS, and the shadcn/ui library, we deliver a friendly, branded interface that teachers and administrators can use with ease. Firebase’s suite of services handles authentication, real-time data, and file storage without custom server code. Vite and GitHub Actions keep developer cycles fast and deployments reliable. Together, these choices align perfectly with our goal of a secure, performant, and scalable School Management Application—ready to manage attendance, journals, and administrative data out of the box.