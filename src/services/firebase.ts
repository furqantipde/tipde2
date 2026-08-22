import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyD1Dn8gxJYeHFiARgki1abucwe-CbSYS1w",
  authDomain: "tipde-597cd.firebaseapp.com",
  projectId: "tipde-597cd",
  storageBucket: "tipde-597cd.firebasestorage.app",
  messagingSenderId: "810138459417",
  appId: "1:810138459417:web:d6a7f750f8fc84f842f988",
  measurementId: "G-XWC68N7FHY"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Analytics - only runs in browser (not during SSR/build)
let analytics: ReturnType<typeof getAnalytics> | null = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export { app, auth, db, analytics }
export const isFirebaseConfigured = true
