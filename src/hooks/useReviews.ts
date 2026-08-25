import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Review, ReviewFilterOptions, NewReviewInput, ReviewStats } from '@/types/review'
import {
  fetchReviews,
  submitReview,
  toggleLikeReview,
  calculateReviewStats,
  getLikedReviewIds,
} from '@/services/reviewService'
import { useAuth } from '@/context/AuthContext'

export function useReviews(initialToolIdFilter?: string) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [filters, setFilters] = useState<ReviewFilterOptions>({
    ratingFilter: 'all',
    toolIdFilter: initialToolIdFilter,
    searchQuery: '',
    sortBy: 'latest',
  })

  // Load reviews & liked ids
  const loadReviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReviews()
      setReviews(data)
      setLikedIds(getLikedReviewIds())
    } catch (err: any) {
      console.error('Error loading reviews:', err)
      setError('Could not load reviews at this time.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  // Filtered and sorted reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        // Rating filter
        if (filters.ratingFilter !== 'all') {
          if (Math.floor(r.rating) !== Number(filters.ratingFilter)) {
            return false
          }
        }
        // Tool filter
        if (filters.toolIdFilter) {
          if (r.toolId !== filters.toolIdFilter) {
            return false
          }
        }
        // Search query
        if (filters.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase()
          const matchTitle = r.title.toLowerCase().includes(q)
          const matchComment = r.comment.toLowerCase().includes(q)
          const matchUser = r.userName.toLowerCase().includes(q)
          const matchTool = r.toolName ? r.toolName.toLowerCase().includes(q) : false
          if (!matchTitle && !matchComment && !matchUser && !matchTool) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        if (filters.sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (filters.sortBy === 'highest') {
          return b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (filters.sortBy === 'lowest') {
          return a.rating - b.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (filters.sortBy === 'most-liked') {
          return b.likes - a.likes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        return 0
      })
  }, [reviews, filters])

  // Aggregate stats based on currently loaded reviews or tool-filtered reviews
  const stats: ReviewStats = useMemo(() => {
    const relevantReviews = filters.toolIdFilter
      ? reviews.filter((r) => r.toolId === filters.toolIdFilter)
      : reviews
    return calculateReviewStats(relevantReviews)
  }, [reviews, filters.toolIdFilter])

  // Handle adding new review
  const addReview = async (input: NewReviewInput) => {
    setSubmitting(true)
    setError(null)
    try {
      const avatar = user?.photoURL || undefined
      const created = await submitReview(input, user?.uid, avatar)
      setReviews((prev) => [created, ...prev])
      return created
    } catch (err: any) {
      console.error('Failed to submit review:', err)
      setError('Failed to submit review. Please try again.')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  // Handle toggling like
  const handleToggleLike = async (reviewId: string) => {
    const userId = user?.uid || 'anon'
    const result = await toggleLikeReview(reviewId, userId)

    setLikedIds((prev) =>
      result.isLiked ? [...prev, reviewId] : prev.filter((id) => id !== reviewId)
    )

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return { ...r, likes: result.newLikesCount }
        }
        return r
      })
    )
  }

  return {
    reviews: filteredReviews,
    allReviews: reviews,
    loading,
    error,
    submitting,
    stats,
    filters,
    setFilters,
    addReview,
    toggleLike: handleToggleLike,
    likedIds,
    refresh: loadReviews,
  }
}
