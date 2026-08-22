import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '@/services/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  isConfigured: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not configured')
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    if (!auth) throw new Error('Firebase not configured')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (name) {
      await updateProfile(cred.user, { displayName: name })
    }
    // Save user to Firestore
    if (db) {
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      })
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!auth) throw new Error('Firebase not configured')
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    // Save user to Firestore if new
    if (db) {
      const userRef = doc(db, 'users', cred.user.uid)
      const snap = await getDoc(userRef)
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: cred.user.displayName || '',
          email: cred.user.email || '',
          createdAt: new Date().toISOString(),
        })
      }
    }
  }, [])

  const logout = useCallback(async () => {
    if (!auth) throw new Error('Firebase not configured')
    await signOut(auth)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured: isFirebaseConfigured, signInWithEmail, signUpWithEmail, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
