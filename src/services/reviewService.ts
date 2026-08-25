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

// No seed reviews - starts empty
const SEED_REVIEWS: Review[] = []

// Helper for local storage
function getLocalReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse local reviews', e)
    return []
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
        
        return firestoreReviews
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
