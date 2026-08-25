import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, ArrowLeft, Star, PlusCircle, MessageSquare } from 'lucide-react'
import type { Tool } from '@/types/tool'
import { useFavorites } from '@/hooks/useFavorites'
import { useReviews } from '@/hooks/useReviews'
import { getCategoryById } from '@/data/categories'
import { getToolsByCategory } from '@/data/tools'
import { Card } from './Card'
import { Button } from './Button'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal'

interface ToolPageLayoutProps {
  tool: Tool
  children: ReactNode
}

export function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const category = getCategoryById(tool.category)
  const relatedTools = getToolsByCategory(tool.category).filter((t) => t.id !== tool.id).slice(0, 4)

  const { reviews, stats, likedIds, toggleLike, addReview } = useReviews(tool.id)
  const [writeModalOpen, setWriteModalOpen] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {category && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${category.color}`}>
                {category.name}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-full border border-amber-200/50 dark:border-amber-800/40">
              <Star className="w-3.5 h-3.5 fill-current" />
              {stats.averageRating.toFixed(1)} ({stats.totalReviews} reviews)
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tool.name}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{tool.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFavorite(tool.id)}
          icon={<Heart className={`w-5 h-5 ${isFavorite(tool.id) ? 'fill-red-500 text-red-500' : ''}`} />}
        >
          {isFavorite(tool.id) ? 'Saved' : 'Save'}
        </Button>
      </div>

      {/* Tool Interface */}
      <Card className="mb-8">{children}</Card>

      {/* How to Use */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">How to Use</h2>
          <ol className="space-y-2">
            {tool.howToUse.map((step, i) => (
              <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Features */}
      {tool.features && tool.features.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Features</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tool.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {tool.faq && tool.faq.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {tool.faq.map((item, i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.question}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Community Ratings & Tool Reviews Section */}
      <section className="mb-10 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Community Reviews & Ratings
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Feedback specifically for {tool.name}
            </p>
          </div>

          <button
            onClick={() => setWriteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Review {tool.name}
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center bg-gray-50/50 dark:bg-gray-800/40">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              No reviews for {tool.name} yet
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Have you used this tool? Share your feedback to help others!
            </p>
            <button
              onClick={() => setWriteModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-medium cursor-pointer"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  isLiked={likedIds.includes(r.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
            <div className="text-center pt-2">
              <Link
                to="/reviews"
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
              >
                View all site reviews →
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedTools.map((rt) => (
              <Card key={rt.id} hoverable onClick={() => navigate(`/tools/${rt.slug}`)}>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{rt.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rt.description}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
        onSubmit={addReview}
        defaultToolId={tool.id}
      />
    </div>
  )
}

