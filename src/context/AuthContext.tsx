import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type User,
  type ConfirmationResult,
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
  sendOtp: (phoneNumber: string, containerId: string) => Promise<ConfirmationResult>
  verifyOtp: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (name) {
      await updateProfile(cred.user, { displayName: name })
    }
    // Save user to Firestore (non-blocking)
    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      })
    } catch (err) {
      console.warn('Failed to save user to Firestore:', err)
    }
  }, [])

  const signInWithGoogleFn = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    // Save user to Firestore if new (non-blocking)
    try {
      const userRef = doc(db, 'users', cred.user.uid)
      const snap = await getDoc(userRef)
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: cred.user.displayName || '',
          email: cred.user.email || '',
          createdAt: new Date().toISOString(),
        })
      }
    } catch (err) {
      console.warn('Failed to save user to Firestore:', err)
    }
  }, [])

  const sendOtp = useCallback(async (phoneNumber: string, containerId: string): Promise<ConfirmationResult> => {
    // Clear any existing reCAPTCHA
    const container = document.getElementById(containerId)
    if (container) container.innerHTML = ''

    const recaptcha = new RecaptchaVerifier(auth, containerId, {
      size: 'normal',
      callback: () => {},
      'expired-callback': () => {},
    })

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha)
    return confirmationResult
  }, [])

  const verifyOtp = useCallback(async (confirmationResult: ConfirmationResult, otp: string) => {
    const cred = await confirmationResult.confirm(otp)
    // Save user to Firestore if new (non-blocking)
    try {
      const userRef = doc(db, 'users', cred.user.uid)
      const snap = await getDoc(userRef)
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: '',
          phone: cred.user.phoneNumber || '',
          createdAt: new Date().toISOString(),
        })
      }
    } catch (err) {
      console.warn('Failed to save user to Firestore:', err)
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isConfigured: isFirebaseConfigured,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle: signInWithGoogleFn,
      sendOtp,
      verifyOtp,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
