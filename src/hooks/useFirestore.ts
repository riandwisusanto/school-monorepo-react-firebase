import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { User, Teacher, Student, Class, Schedule, StudentAttendance, TeacherJournal, TeacherAttendance } from '@/types'

// Generic CRUD operations
export const useFirestore = () => {
  const createDocument = async <T>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error)
      throw error
    }
  }

  const updateDocument = async <T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error)
      throw error
    }
  }

  const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error(`Error deleting document in ${collectionName}:`, error)
      throw error
    }
  }

  const getDocument = async <T>(collectionName: string, docId: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as T
      }
      return null
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error)
      throw error
    }
  }

  const getDocuments = async <T>(
    collectionName: string,
    constraints: any[] = [],
    orderByField: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc'
  ): Promise<T[]> => {
    try {
      const q = query(
        collection(db, collectionName),
        ...constraints,
        orderBy(orderByField, orderDirection)
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as T
      })
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error)
      throw error
    }
  }

  return {
    createDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    getDocuments
  }
}

// User-specific operations
export const useUsers = () => {
  const { getDocument, updateDocument, getDocuments } = useFirestore()

  const getUserById = (userId: string): Promise<User | null> => {
    return getDocument<User>('users', userId)
  }

  const updateUserRole = (userId: string, role: User['role'], teacherType?: User['teacherType']): Promise<void> => {
    return updateDocument('users', userId, { role, teacherType })
  }

  const getUsersByRole = (role: User['role']): Promise<User[]> => {
    return getDocuments<User>('users', [where('role', '==', role)])
  }

  return {
    getUserById,
    updateUserRole,
    getUsersByRole
  }
}

// Teacher-specific operations
export const useTeachers = () => {
  const { createDocument, updateDocument, deleteDocument, getDocument, getDocuments } = useFirestore()

  const createTeacher = (teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return createDocument<Teacher>('teachers', teacherData)
  }

  const updateTeacher = (teacherId: string, teacherData: Partial<Teacher>): Promise<void> => {
    return updateDocument('teachers', teacherId, teacherData)
  }

  const deleteTeacher = (teacherId: string): Promise<void> => {
    return deleteDocument('teachers', teacherId)
  }

  const getTeacherById = (teacherId: string): Promise<Teacher | null> => {
    return getDocument<Teacher>('teachers', teacherId)
  }

  const getTeachersByType = (teacherType: Teacher['teacherType']): Promise<Teacher[]> => {
    return getDocuments<Teacher>('teachers', [where('teacherType', '==', teacherType)])
  }

  const getTeachersByClass = (classId: string): Promise<Teacher[]> => {
    return getDocuments<Teacher>('teachers', [where('assignedClassId', '==', classId)])
  }

  return {
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    getTeachersByType,
    getTeachersByClass
  }
}

// Student-specific operations
export const useStudents = () => {
  const { createDocument, updateDocument, deleteDocument, getDocument, getDocuments } = useFirestore()

  const createStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return createDocument<Student>('students', studentData)
  }

  const updateStudent = (studentId: string, studentData: Partial<Student>): Promise<void> => {
    return updateDocument('students', studentId, studentData)
  }

  const deleteStudent = (studentId: string): Promise<void> => {
    return deleteDocument('students', studentId)
  }

  const getStudentById = (studentId: string): Promise<Student | null> => {
    return getDocument<Student>('students', studentId)
  }

  const getStudentsByClass = (classId: string): Promise<Student[]> => {
    return getDocuments<Student>('students', [where('classId', '==', classId)])
  }

  return {
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentsByClass
  }
}

// File upload operations
export const useFileUpload = () => {
  const uploadFile = async (
    path: string,
    file: File,
    metadata: { [key: string]: string } = {}
  ): Promise<string> => {
    try {
      const storageRef = ref(storage, path)
      const uploadResult = await uploadBytes(storageRef, file, {
        customMetadata: metadata
      })
      const downloadURL = await getDownloadURL(uploadResult.ref)
      return downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  const deleteFile = async (path: string): Promise<void> => {
    try {
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }

  return {
    uploadFile,
    deleteFile
  }
}