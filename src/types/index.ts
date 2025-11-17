// User roles and types
export type UserRole = 'teacher' | 'admin' | 'tu'
export type TeacherType = 'class' | 'subject' | 'both'

export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  teacherType?: TeacherType
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface Teacher {
  id: string
  userId: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  teacherType: TeacherType
  assignedClassId?: string // For class teachers
  subjects: string[] // For subject teachers
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Student {
  id: string
  studentId: string
  firstName: string
  lastName: string
  email?: string
  classId: string
  dateOfBirth: Date
  parentName: string
  parentPhone: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Class {
  id: string
  name: string
  grade: string
  academicYear: string
  homeroomTeacherId: string
  maxStudents: number
  currentStudents: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Schedule {
  id: string
  classId: string
  teacherId: string
  subject: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  room?: string
  semester: string
  academicYear: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StudentAttendance {
  id: string
  studentId: string
  classId: string
  teacherId: string
  date: Date
  status: 'present' | 'sick' | 'permission' | 'absent'
  notes?: string
  submittedAt: Date
  submittedBy: string
}

export interface TeacherJournal {
  id: string
  teacherId: string
  classId: string
  subject?: string
  date: Date
  theme: string
  lessonActivities: string
  notes?: string
  submittedAt: Date
  submittedBy: string
  attachments?: string[] // File URLs from Firebase Storage
}

export interface TeacherAttendance {
  id: string
  teacherId: string
  date: Date
  photoURL: string // Firebase Storage URL
  location?: string
  checkInTime: Date
  submittedAt: Date
}

// For forms and validation
export interface CreateUserData {
  email: string
  password: string
  displayName: string
  role: UserRole
  teacherType?: TeacherType
}

export interface CreateTeacherData {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  teacherType: TeacherType
  assignedClassId?: string
  subjects?: string[]
}

export interface CreateStudentData {
  studentId: string
  firstName: string
  lastName: string
  email?: string
  classId: string
  dateOfBirth: string
  parentName: string
  parentPhone: string
}

export interface CreateClassData {
  name: string
  grade: string
  academicYear: string
  homeroomTeacherId: string
  maxStudents: number
}

export interface CreateScheduleData {
  classId: string
  teacherId: string
  subject: string
  dayOfWeek: number
  startTime: string
  endTime: string
  room?: string
  semester: string
  academicYear: string
}