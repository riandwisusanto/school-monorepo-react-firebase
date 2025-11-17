flowchart TD
    A[Start] --> B[Login]
    B --> C{Authentication success}
    C -->|No| B
    C -->|Yes| D{Role selection}
    D -->|Admin| E[Admin Dashboard]
    D -->|Teacher| F[Teacher Dashboard]
    E --> G[Manage Teachers]
    E --> H[Manage Students]
    E --> I[Manage Classes]
    E --> J[Manage Schedules]
    F --> K[Start Attendance]
    F --> L[Create Journal Entry]
    K --> M[Open Camera]
    M --> N[Capture Photo]
    N --> O[Upload Photo to Storage]
    O --> P[Save Attendance Record]
    P --> Q[Attendance Confirmation]
    L --> R[Fill Journal Form]
    R --> S[Validate Journal Input]
    S --> T[Save Journal Entry]
    T --> Q