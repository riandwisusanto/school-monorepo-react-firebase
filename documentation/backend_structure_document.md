# Backend Structure Document

This document outlines the backend setup for the School Management Application. It covers the architecture, database, APIs, hosting, infrastructure, security, monitoring, and how everything fits together in simple terms.

## 1. Backend Architecture

We use a **serverless, BaaS** (Backend-as-a-Service) approach powered by Firebase. There is no traditional server to manage; instead, we rely on Google’s infrastructure to handle scaling and uptime.

Key technologies used for the backend include:
- Firebase Authentication for user sign-in and roles
- Firebase Firestore as a NoSQL database
- Firebase Storage for storing teacher attendance photos
- Firebase Hosting (with built-in CDN) for any static backend assets or Cloud Functions
- (Optional) Firebase Cloud Functions for custom backend logic

How this architecture helps:
- **Scalability**: Google automatically adds capacity as usage grows—no manual load balancing or server provisioning.
- **Maintainability**: Minimal server code; we manage configuration and security rules in a clear console UI. Feature-based organization keeps code clean.
- **Performance**: Firestore’s regional replication and Firebase Hosting’s CDN ensure low-latency reads and writes. Built-in caching further speeds up common requests.

## 2. Database Management

We rely entirely on Firebase for data storage and management:

• **Firebase Firestore (NoSQL)**
  - Stores structured data in collections and documents.
  - Real-time listeners keep the client in sync without manual refresh.
  - Offline caching allows the app to work when the network is spotty.
  - Indexes are configured automatically or via simple console settings to support fast queries.

• **Firebase Storage**
  - Used for binary assets (photos) uploaded by teachers during attendance.
  - Secure uploads via Firebase SDK with built-in resumable uploads.

• **Data Management Practices**
  - Use Firestore security rules to validate data shapes and enforce access by role.
  - Enable backups for Firestore collections on a schedule.
  - Keep data models as flat as possible to optimize queries.

## 3. Database Schema (NoSQL)

Below is a human-readable outline of our main Firestore collections and their key fields.

1. **users**
   • Stores both Teacher and TU/Admin user profiles.
   • Fields:
     - userId (string) – Unique identifier from Firebase Auth
     - email (string)
     - displayName (string)
     - role (string) – Either “teacher” or “admin”
     - createdAt (timestamp)

2. **teachers**
   • Profile details specific to teachers.
   • Fields:
     - teacherId (string) – Matches userId
     - name (string)
     - subjects (array of strings)
     - classIds (array of strings)

3. **students**
   • Profile for each student.
   • Fields:
     - studentId (string)
     - name (string)
     - classId (string)
     - parentContact (string)

4. **classes**
   • Defines classes and which students/teachers belong.
   • Fields:
     - classId (string)
     - name (string) – e.g., “Grade 10 – A”
     - studentIds (array of strings)
     - teacherIds (array of strings)

5. **schedules**
   • Links teachers to classes and subjects on specific days/times.
   • Fields:
     - scheduleId (string)
     - teacherId (string)
     - classId (string)
     - subject (string)
     - dayOfWeek (string)
     - startTime (string)
     - endTime (string)

6. **studentAttendance**
   • Records daily attendance of students.
   • Fields:
     - attendanceId (string)
     - classId (string)
     - date (date)
     - entries (array of objects):
         • studentId (string)
         • status (string) – e.g., present, absent, sick
         • photoUrl (string, optional)

7. **teacherJournals**
   • Daily logs written by teachers.
   • Fields:
     - journalId (string)
     - teacherId (string)
     - date (date)
     - theme (string)
     - activities (string)
     - reflections (string)

## 4. API Design and Endpoints

We do not host a traditional REST API. Instead, the frontend uses the **Firebase SDK** to perform actions directly. Below are common operations, treated like “endpoints” in everyday language:

• **Authentication**
  - signInWithEmailAndPassword(email, password)
  - signOut()
  - onAuthStateChanged(callback)

• **User Profile**
  - getUserProfile(userId)
  - updateUserRole(userId, role)  (Admin only)

• **Class and Scheduling**
  - listSchedules(teacherId)
  - createSchedule(data)  (Admin only)
  - updateSchedule(scheduleId, data)
  - deleteSchedule(scheduleId)

• **Attendance**
  - startAttendanceSession(classId, date)
  - uploadAttendancePhoto(studentId, file)  → returns photoUrl
  - recordStudentAttendance(classId, date, entries)

• **Teacher Journals**
  - listJournalEntries(teacherId)
  - createJournalEntry(data)
  - updateJournalEntry(journalId, data)
  - deleteJournalEntry(journalId)

• **Administrative Data**
  - CRUD operations on **teachers**, **students**, **classes**
  (All guarded by admin role in Firestore security rules.)

## 5. Hosting Solutions

Our backend is fully hosted on **Firebase**, which gives us:
- **No server management**: Google runs the database and storage servers.
- **Built-in CDN**: Firebase Hosting caches assets worldwide.
- **Automatic scaling**: Services grow with demand, so we don’t worry about traffic spikes.
- **Cost-effectiveness**: Pay for what you use, with a generous free tier for small to medium usage.

(Optional) If we add **Cloud Functions**, they live on Firebase’s serverless platform, scaling automatically and billed only when they run.

## 6. Infrastructure Components

All parts work together to deliver fast, reliable service:

• **Firebase Auth**
  - Manages user sign-in and issues secure tokens.

• **Firestore**
  - NoSQL database with real-time updates and offline sync.
  - Data is geo-replicated and cached for low-latency reads.

• **Firebase Storage**
  - Stores and serves binary files (photos) via Google Cloud Storage.
  - Integrates with Firestore metadata.

• **Firebase Hosting / CDN**
  - Delivers static assets and optional Cloud Functions at the edge.

• **Client-Side Caching**
  - TanStack Query caches Firestore data in the browser to minimize reads and speed up the UI.

• **Security Rules**
  - Act as a virtual “load balancer” for data, filtering and validating every request.

## 7. Security Measures

We protect data and users with multiple layers of security:

1. **Authentication**
   - Firebase Auth requires email/password or other OAuth providers.

2. **Authorization**
   - Custom claims or a `role` field in Firestore distinguish Teachers and Admins.
   - Firestore security rules enforce who can read or write each collection.

3. **Data Encryption**
   - All data in Firestore and Storage is encrypted at rest by Google.
   - Data in transit uses HTTPS/TLS to protect against eavesdropping.

4. **Validation**
   - Firestore rules validate the shape of incoming data (e.g., attendance entries must have valid student IDs).
   - Front-end uses Zod to validate form inputs before sending to the backend.

5. **Compliance**
   - Firebase meets many industry standards. Schools handling student data can rely on Google’s SOC and ISO certifications.

## 8. Monitoring and Maintenance

We use Firebase’s built-in tools plus Google Cloud’s monitoring:

• **Firebase Console**
  - View database usage, storage usage, and active connections.
  - Set up daily or weekly email reports.

• **Google Cloud Monitoring & Logging**
  - Track function invocation, latency, and errors (if using Cloud Functions).
  - Set up alerts for unusual activity (e.g., sudden spike in writes).

• **Performance Monitoring**
  - Use Firebase Performance Monitoring SDK to measure slow reads or writes.

• **Maintenance Practices**
  - Regularly review and update security rules.
  - Schedule automated backups of Firestore data.
  - Keep Firebase and client SDKs up to date for security patches.

## 9. Conclusion and Overall Backend Summary

Our backend leverages Firebase’s serverless platform to deliver a highly scalable, low-maintenance solution for the School Management Application. With Firestore, Storage, and Authentication all handled by Google, we focus on building features—like attendance tracking and teacher journals—rather than servers.

Security is enforced at every layer, from user login to data validation in Firestore rules. Real-time updates and caching ensure a responsive experience for teachers and administrators. Finally, built-in monitoring and automatic scaling keep the system reliable, so educators can use the app without interruption.

This setup aligns perfectly with our goals: rapid development, high performance, and strong security—allowing us to concentrate on delivering a great user experience for teachers, students, and school admins.