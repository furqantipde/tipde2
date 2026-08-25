import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Star,
  Search,
  Filter,
  PlusCircle,
  MessageSquare,
  Sparkles,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'
import { useReviews } from '@/hooks/useReviews'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { ReviewStatsSummary } from '@/components/reviews/ReviewStatsSummary'
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal'
import { tools } from '@/data/tools'

export function ReviewPage() {
  const {
    reviews,
    allReviews,
    loading,
    stats,
    filters,
    setFilters,
    addReview,
    toggleLike,
    likedIds,
  } = useReviews()

  const [writeModalOpen, setWriteModalOpen] = useState(false)

  useEffect(() => {
    document.title = 'User Reviews & Testimonials — TipdeHub'
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
  }

  const handleRatingFilter = (rating: number | 'all') => {
    setFilters((prev) => ({ ...prev, ratingFilter: rating }))
  }

  const handleToolFilter = (toolId: string) => {
    setFilters((prev) => ({ ...prev, toolIdFilter: toolId || undefined }))
  }

  const resetFilters = () => {
    setFilters({
      ratingFilter: 'all',
      toolIdFilter: undefined,
      searchQuery: '',
      sortBy: 'latest',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-4 border border-primary-200/60 dark:border-primary-800/40">
            <Sparkles className="w-4 h-4 text-primary-500" />
            Community Ratings & Reviews
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
            User Reviews & Wall of Love
          </h1>

          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Read transparent feedback from developers, designers, and professionals using TipdeHub’s 100+ browser tools every day.
          </p>
        </div>

        {/* Rating Statistics Summary */}
        <ReviewStatsSummary
          stats={stats}
          onWriteReviewClick={() => setWriteModalOpen(true)}
        />

        {/* Filter, Search & Sort Control Bar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-4 sm:p-6 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.searchQuery || ''}
                onChange={handleSearchChange}
                placeholder="Search reviews by keyword, tool name, or author..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-750 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
              />
            </div>

            {/* Filter by Tool Dropdown */}
            <div className="w-full md:w-64">
              <select
                value={filters.toolIdFilter || ''}
                onChange={(e) => handleToolFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-750 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
              >
                <option value="">All Tools & Features</option>
                {tools.map((tool) => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-750 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
              >
                <option value="latest">Sort by: Most Recent</option>
                <option value="highest">Sort by: Highest Rating</option>
                <option value="lowest">Sort by: Lowest Rating</option>
                <option value="most-liked">Sort by: Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Star Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700/60">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Rating:
              </span>

              <button
                onClick={() => handleRatingFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.ratingFilter === 'all'
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                All Ratings ({allReviews.length})
              </button>

              {[5, 4, 3, 2, 1].map((star) => {
                const count = allReviews.filter((r) => Math.floor(r.rating) === star).length
                const isActive = filters.ratingFilter === star
                return (
                  <button
                    key={star}
                    onClick={() => handleRatingFilter(star)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {star} <Star className="w-3 h-3 fill-current" /> ({count})
                  </button>
                )
              })}
            </div>

            {/* Clear Filters */}
            {(filters.ratingFilter !== 'all' || filters.toolIdFilter || filters.searchQuery) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Reviews ({reviews.length})
          </h3>
          <button
            onClick={() => setWriteModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Write a Review
          </button>
        </div>

        {/* Reviews Grid / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              No Reviews Match Your Filter
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search terms, changing the rating filter, or be the first to review!
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setWriteModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 cursor-pointer"
              >
                Write a Review
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isLiked={likedIds.includes(review.id)}
                onToggleLike={toggleLike}
              />
            ))}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
        onSubmit={addReview}
        defaultToolId={filters.toolIdFilter}
      />
    </div>
  )
}
