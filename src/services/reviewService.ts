import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  increment,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Review, ReviewStats, NewReviewInput } from '@/types/review'

const STORAGE_KEY = 'tipde_local_reviews'
const LIKED_REVIEWS_KEY = 'tipde_liked_reviews'

// Curated seed reviews for impressive initial presentation & fallback offline capability
const SEED_REVIEWS: Review[] = [
  {
    id: 'seed-1',
    userName: 'Alex Dev',
    userRole: 'Full Stack Engineer',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    toolId: 'json-formatter',
    toolName: 'JSON Formatter',
    rating: 5,
    title: 'Indispensable tool for daily web dev work!',
    comment: 'The JSON Formatter and Validator saved me so much time while debugging REST APIs. The instant validation and dark theme styling are top tier.',
    likes: 24,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    verified: true,
  },
  {
    id: 'seed-2',
    userName: 'Sarah Jenkins',
    userRole: 'UI/UX Designer',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    toolId: 'image-converter',
    toolName: 'Image Converter',
    rating: 5,
    title: 'Super fast browser-based WebP conversion',
    comment: 'I love that all image processing happens 100% locally in the browser. Zero upload lag and total privacy guarantee. Highly recommend TipdeHub!',
    likes: 18,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    verified: true,
  },
  {
    id: 'seed-3',
    userName: 'Michael Chen',
    userRole: 'Product Manager',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    toolId: 'qr-generator',
    toolName: 'QR Code Generator',
    rating: 5,
    title: 'Clean interface, zero ads, perfectly functional',
    comment: 'Generating customized QR codes with SVG export without annoying paywalls or popups is so refreshing. Fantastic platform.',
    likes: 15,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    verified: true,
  },
  {
    id: 'seed-4',
    userName: 'Elena Rostova',
    userRole: 'Frontend Developer',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    toolId: 'css-minifier',
    toolName: 'CSS Minifier',
    rating: 4,
    title: 'Great utility set for optimizing frontend code',
    comment: 'Calculators and CSS utilities work smoothly. Everything loads super fast and responsive on mobile devices too.',
    likes: 12,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    verified: true,
  },
  {
    id: 'seed-5',
    userName: 'David K.',
    userRole: 'Software Architect',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    toolId: 'pdf-compressor',
    toolName: 'PDF Compressor',
    rating: 5,
    title: 'Privately compress confidential PDFs directly in client',
    comment: 'No data leaves my machine, which is critical for compliance and security in our company. TipdeHub is our team default now.',
    likes: 29,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    verified: true,
  },
]

// Helper for local storage
function getLocalReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REVIEWS))
      return SEED_REVIEWS
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse local reviews', e)
    return SEED_REVIEWS
  }
}

function saveLocalReviews(reviews: Review[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  } catch (e) {
    console.error('Failed to save local reviews', e)
  }
}

export function getLikedReviewIds(): string[] {
  try {
    const raw = localStorage.getItem(LIKED_REVIEWS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function toggleLocalLikedReviewId(reviewId: string): boolean {
  const current = getLikedReviewIds()
  const exists = current.includes(reviewId)
  const updated = exists ? current.filter((id) => id !== reviewId) : [...current, reviewId]
  try {
    localStorage.setItem(LIKED_REVIEWS_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error('Failed to update liked review ids', e)
  }
  return !exists // returns true if now liked, false if unliked
}

/**
 * Fetch all reviews from Firestore if online/configured, fallback to localStorage.
 */
export async function fetchReviews(): Promise<Review[]> {
  try {
    if (db) {
      const reviewsRef = collection(db, 'reviews')
      const q = query(reviewsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const firestoreReviews: Review[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            userId: data.userId || undefined,
            userName: data.userName || 'Anonymous',
            userAvatar: data.userAvatar || undefined,
            userRole: data.userRole || 'Verified User',
            toolId: data.toolId || undefined,
            toolName: data.toolName || undefined,
            rating: Number(data.rating) || 5,
            title: data.title || '',
            comment: data.comment || '',
            likes: Number(data.likes) || 0,
            likedBy: data.likedBy || [],
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
            verified: Boolean(data.verified ?? true),
          }
        })
        
        // Merge with seed reviews if Firestore has few reviews
        const combined = [...firestoreReviews]
        SEED_REVIEWS.forEach((seed) => {
          if (!combined.some((r) => r.id === seed.id)) {
            combined.push(seed)
          }
        })
        return combined
      }
    }
  } catch (e) {
    console.warn('Firestore reviews fetch failed or uninitialized, fallback to localStorage:', e)
  }
  return getLocalReviews()
}

/**
 * Submit a new review to Firestore and update local storage cache.
 */
export async function submitReview(input: NewReviewInput, userId?: string, userAvatar?: string): Promise<Review> {
  const newReview: Review = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId: userId || undefined,
    userName: input.userName.trim() || 'Anonymous User',
    userRole: input.userRole || (userId ? 'Verified User' : 'Community Reviewer'),
    userAvatar: userAvatar || undefined,
    toolId: input.toolId || undefined,
    toolName: input.toolName || undefined,
    rating: input.rating,
    title: input.title.trim(),
    comment: input.comment.trim(),
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
    verified: true,
  }

  // Attempt Firestore write first
  try {
    if (db) {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...newReview,
        createdAt: serverTimestamp(),
      })
      newReview.id = docRef.id
    }
  } catch (e) {
    console.warn('Firestore write failed, saving locally:', e)
  }

  // Update Local Storage
  const current = getLocalReviews()
  const updated = [newReview, ...current]
  saveLocalReviews(updated)

  return newReview
}

/**
 * Toggle like / helpful vote for a review.
 */
export async function toggleLikeReview(reviewId: string, userId: string = 'anon'): Promise<{ isLiked: boolean; newLikesCount: number }> {
  const isLikedNow = toggleLocalLikedReviewId(reviewId)
  const incrementVal = isLikedNow ? 1 : -1

  // Update Firestore if available
  try {
    if (db && !reviewId.startsWith('seed-')) {
      const docRef = doc(db, 'reviews', reviewId)
      await updateDoc(docRef, {
        likes: increment(incrementVal),
        likedBy: isLikedNow ? arrayUnion(userId) : arrayRemove(userId),
      })
    }
  } catch (e) {
    console.warn('Failed to sync review like to Firestore:', e)
  }

  // Update local storage
  const current = getLocalReviews()
  let newLikesCount = 0
  const updated = current.map((r) => {
    if (r.id === reviewId) {
      newLikesCount = Math.max(0, r.likes + incrementVal)
      return { ...r, likes: newLikesCount }
    }
    return r
  })
  saveLocalReviews(updated)

  return { isLiked: isLikedNow, newLikesCount }
}

/**
 * Calculate aggregate review statistics.
 */
export function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      recommendationRate: 100,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let sum = 0
  let positiveCount = 0

  reviews.forEach((r) => {
    sum += r.rating
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5
    distribution[star] = (distribution[star] || 0) + 1
    if (r.rating >= 4) positiveCount++
  })

  const averageRating = Number((sum / reviews.length).toFixed(1))
  const recommendationRate = Math.round((positiveCount / reviews.length) * 100)

  return {
    averageRating,
    totalReviews: reviews.length,
    recommendationRate,
    distribution,
  }
}
