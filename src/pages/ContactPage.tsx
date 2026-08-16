import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Mail, MessageSquare, Bug, Lightbulb, Phone, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const REASONS = [
  { value: 'general', label: 'General Inquiry', icon: MessageSquare },
  { value: 'bug', label: 'Report a Bug', icon: Bug },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb },
  { value: 'advertising', label: 'Advertising', icon: Mail },
  { value: 'privacy', label: 'Privacy Concern', icon: Mail },
]

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'general',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to a backend or email service
    setSubmitted(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Contact Us</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Have a question, found a bug, or want to suggest a new tool? We'd love to hear from you.
        Fill out the form below and we'll get back to you as soon as possible.
      </p>

      {submitted ? (
        <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">Message Sent!</h2>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Thank you for reaching out. We'll review your message and get back to you within 24-48 hours.
          </p>
          <Button variant="outline" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', reason: 'general', message: '' }) }}>
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Contact
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REASONS.map((reason) => {
                const Icon = reason.icon
                return (
                  <button
                    key={reason.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, reason: reason.value })}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                      formData.reason === reason.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-600'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {reason.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your question, bug report, or feature request in detail..."
              rows={6}
              required
              className="w-full rounded-lg border border-gray-300 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
            />
          </div>

          <Button type="submit" icon={<Send className="w-4 h-4" />}>
            Send Message
          </Button>
        </form>
      )}

      {/* Additional Contact Info */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Email</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            For direct inquiries and support.
          </p>
          <a href="mailto:fchattha206@gmail.com" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            fchattha206@gmail.com
          </a>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Phone</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Call us for quick support.
          </p>
          <a href="tel:03279321434" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            0327-9321434
          </a>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-red-600 dark:text-red-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">YouTube</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Watch tutorials and updates.
          </p>
          <a href="https://www.youtube.com/@furqantipde" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            @furqantipde
          </a>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}
