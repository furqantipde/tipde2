import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomePage } from '@/pages/HomePage'
import { CategoryPage } from '@/pages/CategoryPage'
import { ToolPage } from '@/pages/ToolPage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage'
import { TermsOfServicePage } from '@/pages/TermsOfServicePage'
import { DisclaimerPage } from '@/pages/DisclaimerPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AuthPage } from '@/pages/AuthPage'
import { SavedToolsPage } from '@/pages/SavedToolsPage'
import { ReviewPage } from '@/pages/ReviewPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { PricingPage } from '@/pages/PricingPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { YouTubeProgressBar } from '@/components/ui/YouTubeProgressBar'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <YouTubeProgressBar />
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Protected routes - require login */}
            <Route path="/category/:categoryId" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
            <Route path="/tools/:slug" element={<ProtectedRoute><ToolPage /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><SavedToolsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}
