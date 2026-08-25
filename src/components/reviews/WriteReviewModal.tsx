import { useState, useEffect } from 'react'
import { X, Star, Loader2, AlertCircle } from 'lucide-react'
import { tools } from '@/data/tools'
import { useAuth } from '@/context/AuthContext'
import type { NewReviewInput } from '@/types/review'

interface WriteReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: NewReviewInput) => Promise<any>
  defaultToolId?: string
}

export function WriteReviewModal({
  isOpen,
  onClose,
  onSubmit,
  defaultToolId,
}: WriteReviewModalProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [selectedToolId, setSelectedToolId] = useState<string>(defaultToolId || '')
  const [userName, setUserName] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || '')
      setUserRole('Verified Member')
    } else {
      setUserName('')
      setUserRole('Developer / User')
    }
  }, [user, isOpen])

  useEffect(() => {
    if (defaultToolId) {
      setSelectedToolId(defaultToolId)
    }
  }, [defaultToolId])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!userName.trim()) {
      setErrorMessage('Please enter your name.')
      return
    }
    if (!title.trim()) {
      setErrorMessage('Please provide a title for your review.')
      return
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMessage('Please write a comment of at least 10 characters.')
      return
    }

    const matchedTool = tools.find((t) => t.id === selectedToolId)

    try {
      setSubmitting(true)
      await onSubmit({
        userName: userName.trim(),
        userRole: userRole.trim() || undefined,
        toolId: matchedTool ? matchedTool.id : undefined,
        toolName: matchedTool ? matchedTool.name : undefined,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      })

      // Reset and close
      setTitle('')
      setComment('')
      onClose()
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error submitting review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Write a Community Review
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tool selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Select Tool (Optional)
            </label>
            <select
              value={selectedToolId}
              onChange={(e) => setSelectedToolId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
            >
              <option value="">General Platform Review (TipdeHub)</option>
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating stars */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                {rating === 5 && 'Excellent! 🌟'}
                {rating === 4 && 'Very Good 👍'}
                {rating === 3 && 'Good 👌'}
                {rating === 2 && 'Fair 😐'}
                {rating === 1 && 'Poor 👎'}
              </span>
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Your Role / Occupation
              </label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Review Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fast, reliable, and completely private tools!"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
            />
          </div>

          {/* Detailed Feedback */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Your Review & Comments *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share what you liked about TipdeHub or specific tools..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white shadow-md disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
