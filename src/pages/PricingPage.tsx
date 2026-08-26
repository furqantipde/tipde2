import { useEffect, useState } from 'react'
import { Check, X, Zap, Crown, Building2, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: Zap,
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    color: 'gray',
    features: [
      { text: 'Access to all 30+ tools', included: true },
      { text: 'Basic tool usage', included: true },
      { text: 'Save up to 5 tools', included: true },
      { text: 'Community support', included: true },
      { text: 'API access', included: false },
      { text: 'Priority support', included: false },
      { text: 'Custom branding', included: false },
      { text: 'Advanced analytics', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Crown,
    price: 9.99,
    period: 'month',
    description: 'Best for professionals & power users',
    color: 'primary',
    features: [
      { text: 'Access to all 30+ tools', included: true },
      { text: 'Unlimited tool usage', included: true },
      { text: 'Unlimited saved tools', included: true },
      { text: 'Priority email support', included: true },
      { text: 'API access', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom branding', included: false },
      { text: 'White-label solution', included: false },
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    price: 29.99,
    period: 'month',
    description: 'For teams and businesses',
    color: 'purple',
    features: [
      { text: 'Access to all 30+ tools', included: true },
      { text: 'Unlimited tool usage', included: true },
      { text: 'Unlimited saved tools', included: true },
      { text: '24/7 dedicated support', included: true },
      { text: 'Full API access', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom branding', included: true },
      { text: 'White-label solution', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export function PricingPage() {
  const { user } = useAuth()
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Pricing & Plans — TipdeHub'
  }, [])

  const handleCheckout = async (planId: string) => {
    if (!user) {
      // Redirect to login
      window.location.hash = '#/auth'
      return
    }

    if (planId === 'free') {
      // Free plan - no checkout needed
      return
    }

    if (planId === 'enterprise') {
      // Enterprise - redirect to contact
      window.location.hash = '#/contact'
      return
    }

    setProcessing(planId)
    try {
      // Load payment provider script
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        const handler = (window as any).paystackSetup({
          key: 'pk_live_4355470e-b9a1-4bf4-9577-dfdb38c1ceb0',
          email: user.email || 'user@tipde.online',
          amount: planId === 'pro' ? 999 : 2999, // Amount in kobo/cents
          currency: 'USD',
          ref: `tipde_${planId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          metadata: {
            custom_fields: [
              {
                display_name: 'Plan',
                variable_name: 'plan',
                value: planId,
              },
              {
                display_name: 'User ID',
                variable_name: 'user_id',
                value: user.uid,
              },
            ],
          },
          callback: (response: any) => {
            console.log('Payment successful:', response)
            alert('Payment successful! Your plan has been upgraded.')
            setProcessing(null)
          },
          onClose: () => {
            setProcessing(null)
          },
        })

        handler.openIframe()
      }

      script.onerror = () => {
        console.error('Failed to load payment script')
        setProcessing(null)
        alert('Payment system unavailable. Please try again later.')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setProcessing(null)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const Icon = plan.icon
            const isPopular = plan.popular
            const isProcessing = processing === plan.id

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 ${
                  isPopular
                    ? 'border-primary-500 shadow-xl shadow-primary-500/10'
                    : 'border-gray-200 dark:border-gray-700'
                } bg-white dark:bg-gray-800 p-8 flex flex-col`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-500 text-white text-xs font-bold uppercase tracking-wide">
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    plan.color === 'primary'
                      ? 'bg-primary-100 dark:bg-primary-900/30'
                      : plan.color === 'purple'
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      plan.color === 'primary'
                        ? 'text-primary-600 dark:text-primary-400'
                        : plan.color === 'purple'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900 dark:text-gray-100">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isPopular
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-left">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I switch plans anytime?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our Free plan gives you access to all basic tools. Upgrade to Pro or Enterprise for advanced features.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We accept all major credit cards, debit cards, and other secure payment methods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
