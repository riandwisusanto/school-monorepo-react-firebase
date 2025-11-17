import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User, UserRole, TeacherType } from '@/types'

interface AuthContextType {
  user: (User & { firebaseUser: FirebaseUser }) | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string, role: UserRole, teacherType?: TeacherType) => Promise<void>
  logout: () => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<(User & { firebaseUser: FirebaseUser }) | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        return userDoc.data() as User
      }
      return null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  const refreshUserData = async () => {
    if (auth.currentUser) {
      const userData = await fetchUserData(auth.currentUser)
      if (userData) {
        setUser({ ...userData, firebaseUser: auth.currentUser })
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)

      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser)
        if (userData) {
          setUser({ ...userData, firebaseUser })
        } else {
          // User exists in Auth but not in Firestore, sign them out
          await signOut(auth)
          setUser(null)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userData = await fetchUserData(userCredential.user)
      if (userData) {
        setUser({ ...userData, firebaseUser: userCredential.user })
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    teacherType?: TeacherType
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName })

      // Create user document in Firestore
      const userData: User = {
        id: userCredential.user.uid,
        email,
        displayName,
        photoURL: userCredential.user.photoURL,
        role,
        teacherType,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      setUser({ ...userData, firebaseUser: userCredential.user })
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    refreshUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}