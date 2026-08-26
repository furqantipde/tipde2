import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { CreditCard, Lock, Shield, ArrowLeft, Loader2, CheckCircle2, User, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const PLAN_INFO: Record<string, { name: string; price: number; period: string; color: string }> = {
  pro: { name: 'Pro', price: 9.99, period: 'month', color: 'primary' },
  enterprise: { name: 'Enterprise', price: 29.99, period: 'month', color: 'purple' },
}

export function CheckoutPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('plan') || 'pro'
  const plan = PLAN_INFO[planId] || PLAN_INFO.pro

  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardName, setCardName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Checkout — TipdeHub'
    if (!user) {
      navigate('/auth', { state: { from: { pathname: `/checkout?plan=${planId}` } } })
    }
  }, [user, navigate, planId])

  useEffect(() => {
    if (user) {
      setCardName(user.displayName || '')
    }
  }, [user])

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return digits
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanCard = cardNumber.replace(/\s/g, '')
    if (cleanCard.length < 16) {
      setError('Please enter a valid card number')
      return
    }
    if (expiry.length < 5) {
      setError('Please enter a valid expiry date')
      return
    }
    if (cvc.length < 3) {
      setError('Please enter a valid CVC')
      return
    }
    if (!cardName.trim()) {
      setError('Please enter the cardholder name')
      return
    }

    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)
      setTimeout(() => {
        navigate('/profile')
      }, 3000)
    }, 2500)
  }

  if (!user) return null

  // Success screen
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 p-10 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            You've been upgraded to the <span className="font-semibold text-primary-600 dark:text-primary-400">{plan.name}</span> plan.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Redirecting to your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        to="/pricing"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Pricing
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Payment Form */}
        <div className="md:col-span-3">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Payment Details</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Complete your purchase securely</p>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handlePay} className="space-y-5">
              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Cardholder Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-mono tracking-wider"
                  />
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-mono text-center"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email for Receipt
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={user.email || ''}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-sm"
                  />
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 px-6 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ${plan.price}
                  </>
                )}
              </button>
            </form>

            {/* Security badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                SSL Encrypted
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure Payment
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>

            <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">TipdeHub {plan.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Billed monthly</p>
                </div>
                <p className="font-bold text-gray-900 dark:text-gray-100">${plan.price}</p>
              </div>
            </div>

            <div className="space-y-2 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-gray-100">${plan.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-gray-100">$0.00</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <span className="font-bold text-gray-900 dark:text-gray-100">Total</span>
              <span className="font-bold text-xl text-gray-900 dark:text-gray-100">${plan.price}</span>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-green-700 dark:text-green-400">What you get:</p>
                  <ul className="text-xs text-green-600 dark:text-green-500 mt-1 space-y-1">
                    {planId === 'pro' ? (
                      <>
                        <li>Unlimited tool access</li>
                        <li>API access</li>
                        <li>Priority support</li>
                        <li>Advanced analytics</li>
                      </>
                    ) : (
                      <>
                        <li>Everything in Pro</li>
                        <li>Custom branding</li>
                        <li>White-label solution</li>
                        <li>24/7 dedicated support</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
