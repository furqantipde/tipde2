import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function YouTubeProgressBar() {
  const location = useLocation()
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Trigger animation on route change
    setIsAnimating(true)
    setProgress(30)

    const timer1 = setTimeout(() => {
      setProgress(75)
    }, 150)

    const timer2 = setTimeout(() => {
      setProgress(100)
    }, 350)

    const timer3 = setTimeout(() => {
      setIsAnimating(false)
      setProgress(0)
    }, 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [location.pathname, location.search])

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[3px]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* YouTube Red / Primary Gradient Progress Bar */}
          <div
            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400 dark:from-red-500 dark:via-rose-500 dark:to-amber-300 transition-all duration-300 ease-out shadow-[0_0_10px_#ef4444]"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
