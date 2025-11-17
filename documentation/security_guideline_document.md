# Security Guidelines for school-monorepo-react-firebase

This document provides actionable security best practices for the **school-monorepo-react-firebase** application. It follows industry-standard principles—Security by Design, Least Privilege, Defense in Depth, Input Validation, and Secure Defaults—ensuring a robust, maintainable, and trustworthy solution for school management.

---

## 1. Secure Authentication & Role-Based Access Control (RBAC)

- Enforce Firebase Authentication with strong password policies:
  - Minimum length (≥ 12 characters), complexity (uppercase, numbers, symbols).
  - Use Firebase’s built-in email/password or SSO providers; never roll your own.
- Apply **Firebase Custom Claims** or a Firestore `role` field to distinguish `Teacher` vs. `TU/Admin`:
  - Set custom claims via Cloud Functions or Admin SDK. Validate claims on every protected route.
- Protect front-end routes and GraphQL/REST calls with server-side checks:
  - In React Router, implement protected routes that verify user roles before rendering.
  - On each API call, verify the JWT token and claims on the back end or via Firebase Cloud Functions.
- Secure session management:
  - Leverage Firebase’s short-lived ID tokens (1 hour) and refresh tokens stored in **Secure**, **HttpOnly**, **SameSite=Strict** cookies.
  - Provide explicit logout flows and revoke refresh tokens upon logout.
- Enforce Multi-Factor Authentication (MFA) for TU/Admin accounts using Firebase MFA.

---

## 2. Input Handling & Data Validation

- Always treat all user input as untrusted. Validate at the server (Cloud Functions or your API layer) and client:
  - Use **Zod** schemas on both client and Cloud Functions to enforce data types, lengths, and allowed values for attendance records, journal entries, schedules, etc.
  - Sanitize string inputs to prevent injection of malicious payloads or script tags.
- Prevent Firestore injection:
  - Never construct dynamic paths or queries by concatenating raw user input. Use parameterized references: 
    ```ts
    const docRef = doc(db, 'studentAttendance', attendanceId);
    ```
- Secure file uploads (teacher attendance photos):
  - Restrict file types to images (JPEG/PNG) and enforce a maximum file size (e.g., 5 MB).
  - Validate image content server-side (e.g., using a Cloud Function trigger to scan with a malware scanner).
  - Store uploads in a Firestore-enforced folder structure (e.g., `/attendancePhotos/{classId}/{attendanceId}.jpg`).

---

## 3. Data Protection & Privacy

- Encrypt data in transit: 
  - Enforce TLS 1.2+ for all Firebase SDK communications (default).
- Encrypt sensitive data at rest:
  - Firestore and Firebase Storage use Google-managed encryption by default.
  - For extra PII fields (e.g., birthdates), consider client-side encryption before upload.
- Manage secrets securely:
  - Do **not** hard-code API keys, service account credentials, or environment variables in source. Use Firebase Functions environment config (`firebase functions:config:set`) or a secrets manager (e.g., Google Secret Manager).
- Mask PII in logs:
  - Avoid logging user emails, identification numbers, or attendance images. Log only event IDs or anonymized fields.
- Data retention & deletion:
  - Implement Firestore TTL (Time to Live) rules or scheduled Cloud Functions to purge old journal entries after school-defined retention periods.

---

## 4. API & Firebase Security Rules

- Enforce strict Firebase Security Rules for Firestore and Storage:
  - Use granular path rules:
    ```js
    match /attendancePhotos/{classId}/{fileName} {
      allow read: if request.auth.uid == resource.data.teacherId;
      allow write: if request.auth.uid == request.resource.data.teacherId;
    }
    ```
  - Validate document structure and field types inside rules (e.g., `request.resource.data.status in ['present','sick',...]`).
- Rate limit critical operations via Cloud Functions:
  - Throttle attendance marking and journal creation to 10 requests/min per user to prevent abuse.
- CORS:
  - Restrict allowed origins in Cloud Functions to the school’s domain(s) only.

---

## 5. Web Application Security Hygiene

- Use secure HTTP headers (applied via hosting or reverse proxy):
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `Content-Security-Policy`: disallow inline scripts/styles; whitelist your CDN and domain.
  - `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'` to prevent clickjacking.
  - `X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer-when-downgrade`.
- Anti-CSRF:
  - For state-changing operations in your React app calling Cloud Functions REST endpoints, embed CSRF tokens in forms and verify them server-side.
- Secure cookies:
  - Set `Secure`, `HttpOnly`, `SameSite=Strict` on any cookies used for session storage.
- Avoid storing tokens or PII in `localStorage` or `sessionStorage`.
- Implement Subresource Integrity (SRI) on any third-party CDN assets.

---

## 6. Infrastructure & Configuration Management

- Harden hosting environment (e.g., Firebase Hosting or Vercel):
  - Disable directory listing, debug endpoints, and default pages.
- Enforce principle of least privilege for IAM roles:
  - Grant Cloud Functions only Firestore/Storage permissions required for their operations.
  - Use separate service accounts for Admin operations vs. public-facing functions.
- Keep all dependencies and Firebase SDKs up to date.
- Use environment-specific configurations:
  - Development vs. staging vs. production. Disable verbose logging in production.

---

## 7. Dependency Management

- Maintain `package-lock.json` and/or `yarn.lock` for deterministic builds.
- Vet all third-party libraries (e.g., `react-webcam`, `shadcn/ui`) for recent security audits and active maintenance.
- Integrate an SCA tool (e.g., GitHub Dependabot, Snyk) to detect CVEs in direct and transitive dependencies.
- Remove unused packages to minimize the attack surface.

---

## 8. DevOps & CI/CD Security

- Secure your CI pipeline (GitHub Actions):
  - Protect secrets via encrypted CI variables; avoid printing them in logs.
  - Run `npm audit --audit-level=high` and fail builds on critical vulnerabilities.
  - Include automated linting, type-checking, and unit tests (Vitest, React Testing Library).
- Automate deployments to hosting with restricted permissions:
  - Grant the CI service account only the deploy permission, not full project administration.
- Run static analysis (ESLint security plugins) and dependency scanning on every pull request.

---

## 9. Mobile & PWA Considerations (if applicable)

- If exposing a PWA or mobile interface:
  - Use secure storage (e.g., Keychain on iOS, EncryptedSharedPreferences on Android) via Capacitor or React Native plugins.
  - Enforce the same authentication, input validation, and data encryption standards.
  - Implement certificate pinning on native bridges if calling external APIs.

---

By embedding these practices from design through deployment, the **school-monorepo-react-firebase** application will achieve a layered, resilient security posture, protecting student and teacher data, preserving privacy, and maintaining regulatory compliance.
