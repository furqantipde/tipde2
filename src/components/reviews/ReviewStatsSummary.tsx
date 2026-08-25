import { Star, Award, ThumbsUp, PlusCircle } from 'lucide-react'
import type { ReviewStats } from '@/types/review'

interface ReviewStatsSummaryProps {
  stats: ReviewStats
  onWriteReviewClick: () => void
}

export function ReviewStatsSummary({ stats, onWriteReviewClick }: ReviewStatsSummaryProps) {
  const { averageRating, totalReviews, recommendationRate, distribution } = stats

  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0
    return Math.round((count / totalReviews) * 100)
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/90 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Rating Big Number & Badges */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700/80 pb-6 lg:pb-0 lg:pr-8">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xl font-medium text-gray-400 dark:text-gray-500">/ 5.0</span>
          </div>

          <div className="flex items-center gap-1 my-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>

          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">
            Based on <span className="font-bold text-gray-900 dark:text-gray-100">{totalReviews}</span> community reviews
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <ThumbsUp className="w-3.5 h-3.5" />
            {recommendationRate}% positive satisfaction rate
          </div>
        </div>

        {/* Rating Breakdown Progress Bars */}
        <div className="lg:col-span-5 space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star as 1 | 2 | 3 | 4 | 5] || 0
            const pct = getPercentage(count)
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1 shrink-0">
                  {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400 inline" />
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-semibold text-gray-500 dark:text-gray-400 shrink-0">
                  {pct}%
                </span>
              </div>
            )
          })}
        </div>

        {/* CTA Column */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700/80 pt-6 lg:pt-0 lg:pl-8 text-center">
          <Award className="w-10 h-10 text-primary-500 mb-2" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
            Share Your Experience
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
            Help improve TipdeHub by rating our developer and daily online utilities.
          </p>
          <button
            onClick={onWriteReviewClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Write a Review
          </button>
        </div>
      </div>
    </div>
  )
}
