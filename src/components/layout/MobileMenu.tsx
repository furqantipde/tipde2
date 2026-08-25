import { Link } from 'react-router-dom'
import { X, Heart, LogOut, User as UserIcon, Star } from 'lucide-react'
import { categories } from '@/data/categories'
import { useAuth } from '@/context/AuthContext'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth()

  if (!isOpen) return null

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || user?.phoneNumber?.slice(-1) || '?'

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            Tipde<span className="text-gray-900 dark:text-gray-100">Hub</span>
          </span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User info / Sign in */}
        {user ? (
          <div className="mx-4 mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                {user.displayName && (
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.displayName}</p>
                )}
                {user.email ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                ) : user.phoneNumber ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.phoneNumber}</p>
                ) : null}
              </div>
            </div>
            <button
              onClick={() => { logout(); onClose() }}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mx-4 mt-4">
            <Link
              to="/auth"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        )}

        <nav className="p-4 space-y-1">
          <Link
            to="/"
            onClick={onClose}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Home
          </Link>
          <div className="pt-2 pb-1 px-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
          </div>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              onClick={onClose}
              className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/about"
            onClick={onClose}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            About
          </Link>
          <Link
            to="/reviews"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Reviews
          </Link>
          <Link
            to="/saved"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Heart className="w-4 h-4 text-red-500" />
            Saved Tools
          </Link>
        </nav>
      </div>
    </>
  )
}
