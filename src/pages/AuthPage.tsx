import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Loader2, Phone, Shield, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import type { ConfirmationResult } from 'firebase/auth'

type AuthMethod = 'google' | 'email' | 'phone'
type PhoneStep = 'number' | 'otp'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [activeMethod, setActiveMethod] = useState<AuthMethod>('google')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Phone auth state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('number')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const recaptchaRef = useRef<HTMLDivElement>(null)

  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle, sendOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const targetPath = (location.state as any)?.from?.pathname || '/'

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate(targetPath, { replace: true })
    }
  }, [user, authLoading, navigate, targetPath])

  const showSuccessAndRedirect = () => {
    setSuccess(true)
    setTimeout(() => {
      navigate(targetPath, { replace: true })
    }, 1000)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password, name)
      }
      setLoading(false)
      showSuccessAndRedirect()
    } catch (err: unknown) {
      setLoading(false)
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      if (msg.includes('user-not-found')) setError('No account found with this email.')
      else if (msg.includes('wrong-password')) setError('Incorrect password.')
      else if (msg.includes('invalid-email')) setError('Please enter a valid email address.')
      else if (msg.includes('weak-password')) setError('Password must be at least 6 characters.')
      else if (msg.includes('email-already-in-use')) setError('An account with this email already exists.')
      else setError(msg)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      setLoading(false)
      showSuccessAndRedirect()
    } catch (err: unknown) {
      setLoading(false)
      const msg = err instanceof Error ? err.message : 'Google sign-in failed'
      if (msg.includes('popup-closed')) setError('Sign-in popup was closed. Please try again.')
      else setError(msg)
    }
  }

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await sendOtp(phoneNumber, 'recaptcha-container')
      setConfirmationResult(result)
      setPhoneStep('otp')
      setLoading(false)
    } catch (err: unknown) {
      setLoading(false)
      const msg = err instanceof Error ? err.message : 'Failed to send OTP'
      if (msg.includes('invalid-phone-number')) setError('Please enter a valid phone number with country code.')
      else setError(msg)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length < 6) {
      setError('Please enter the 6-digit OTP.')
      return
    }
    if (!confirmationResult) {
      setError('Please request an OTP first.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await verifyOtp(confirmationResult, otp)
      setLoading(false)
      showSuccessAndRedirect()
    } catch (err: unknown) {
      setLoading(false)
      const msg = err instanceof Error ? err.message : 'OTP verification failed'
      if (msg.includes('code-expired')) setError('OTP has expired. Please request a new one.')
      else if (msg.includes('invalid-verification-code')) setError('Incorrect OTP. Please try again.')
      else setError(msg)
    }
  }

  const switchMethod = (method: AuthMethod) => {
    setActiveMethod(method)
    setError('')
    setPhoneStep('number')
    setOtp('')
    setConfirmationResult(null)
  }

  // Success screen
  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="rounded-xl border border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 p-10 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Verified!</h2>
          <p className="text-gray-600 dark:text-gray-400">Sign-in successful. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {isLogin ? 'Sign in to access all TipdeHub tools' : 'Join TipdeHub to save your favorites and more'}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        {/* Method Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {(['google', 'email', 'phone'] as AuthMethod[]).map((method) => (
            <button
              key={method}
              onClick={() => switchMethod(method)}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                activeMethod === method
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {method === 'google' ? (
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
              ) : method === 'email' ? (
                <Mail className="w-5 h-5" />
              ) : (
                <Phone className="w-5 h-5" />
              )}
              <span className="capitalize">{method}</span>
            </button>
          ))}
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Method */}
        {activeMethod === 'google' && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>
        )}

        {/* Email Method */}
        {activeMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>

            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError('') }}
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </form>
        )}

        {/* Phone Method */}
        {activeMethod === 'phone' && (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {phoneStep === 'number' ? (
                <motion.div
                  key="number"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                    Enter your phone number with country code
                  </p>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                  <div id="recaptcha-container" ref={recaptchaRef} className="flex justify-center" />
                  <Button onClick={handleSendOtp} className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      OTP sent to <span className="font-medium text-gray-900 dark:text-gray-100">{phoneNumber}</span>
                    </p>
                  </div>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm text-center font-mono tracking-widest placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                  <Button onClick={handleVerifyOtp} className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Sign In'}
                  </Button>
                  <button
                    onClick={() => { setPhoneStep('number'); setOtp(''); setConfirmationResult(null); setError('') }}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                  >
                    Change phone number
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        By continuing, you agree to our{' '}
        <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</Link>{' '}
        and{' '}
        <Link to="/privacy-policy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</Link>
      </p>
    </div>
  )
}
