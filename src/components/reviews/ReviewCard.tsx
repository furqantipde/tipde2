import { Link } from 'react-router-dom'
import { Star, ThumbsUp, CheckCircle2, MessageSquareQuote } from 'lucide-react'
import type { Review } from '@/types/review'

interface ReviewCardProps {
  review: Review
  isLiked?: boolean
  onToggleLike?: (reviewId: string) => void
}

export function ReviewCard({ review, isLiked = false, onToggleLike }: ReviewCardProps) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const userInitial = review.userName.charAt(0).toUpperCase() || 'U'

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-6 shadow-xs hover:shadow-md transition-all">
      <div>
        {/* Top Header: User Info & Verified Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {review.userAvatar ? (
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                {userInitial}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-tight">
                  {review.userName}
                </h4>
                {review.verified && (
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-500 shrink-0"
                    title="Verified Reviewer"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {review.userRole || 'Community Reviewer'}
              </p>
            </div>
          </div>

          {/* Date */}
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {formattedDate}
          </span>
        </div>

        {/* Rating Stars & Tool Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="ml-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              {review.rating}.0
            </span>
          </div>

          {review.toolName && (
            <Link
              to={review.toolId ? `/tools/${review.toolId}` : '#'}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/40 hover:underline"
            >
              <MessageSquareQuote className="w-3 h-3" />
              {review.toolName}
            </Link>
          )}
        </div>

        {/* Review Title */}
        <h5 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 leading-snug">
          "{review.title}"
        </h5>

        {/* Review Body */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-4">
          {review.comment}
        </p>
      </div>

      {/* Card Footer: Helpful / Upvote button */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Was this review helpful?
        </span>
        <button
          onClick={() => onToggleLike?.(review.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            isLiked
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 font-semibold'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/60 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          aria-label="Helpful vote"
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          <span>Helpful</span>
          {review.likes > 0 && <span className="font-bold">({review.likes})</span>}
        </button>
      </div>
    </div>
  )
}
