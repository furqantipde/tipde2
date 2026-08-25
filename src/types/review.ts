export interface Review {
  id: string
  userId?: string
  userName: string
  userAvatar?: string
  userRole?: string
  toolId?: string
  toolName?: string
  rating: number // 1 to 5
  title: string
  comment: string
  likes: number
  likedBy?: string[] // user IDs or browser IDs who liked this
  createdAt: string // ISO string
  verified: boolean
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  recommendationRate: number // percentage e.g. 98%
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export type ReviewSortOption = 'latest' | 'highest' | 'lowest' | 'most-liked'

export interface ReviewFilterOptions {
  ratingFilter: number | 'all' // 5, 4, 3, 2, 1, or 'all'
  toolIdFilter?: string
  searchQuery?: string
  sortBy: ReviewSortOption
}

export interface NewReviewInput {
  userName: string
  userRole?: string
  toolId?: string
  toolName?: string
  rating: number
  title: string
  comment: string
}
