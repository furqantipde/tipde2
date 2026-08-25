import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, MessageSquare, ArrowRight, PlusCircle } from 'lucide-react'
import { useReviews } from '@/hooks/useReviews'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal'

export function HomeTestimonials() {
  const { reviews, stats, likedIds, toggleLike, addReview } = useReviews()
  const [modalOpen, setModalOpen] = useState(false)

  // Top 3 reviews for home preview
  const topReviews = reviews.slice(0, 3)

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3 border border-amber-200/60 dark:border-amber-800/40">
              <Star className="w-3.5 h-3.5 fill-current" />
              Community Wall of Love
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Trusted by Thousands of Developers & Professionals
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
              See what our community members are saying about our 100+ free, fast, and privacy-first web utilities.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-primary-500" />
              Write Review
            </button>

            <Link
              to="/reviews"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-all shadow-md cursor-pointer"
            >
              View All ({stats.totalReviews})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Rating Highlights Bar */}
        <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/70 mb-8 shadow-xs text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(stats.averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <div className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {stats.recommendationRate}%
            </span>{' '}
            Satisfaction Score
          </div>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <div className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {stats.totalReviews}
            </span>{' '}
            Verified Reviews
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isLiked={likedIds.includes(review.id)}
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      </div>

      <WriteReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addReview}
      />
    </section>
  )
}
