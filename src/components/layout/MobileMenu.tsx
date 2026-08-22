import { Link } from 'react-router-dom'
import { X, Heart } from 'lucide-react'
import { categories } from '@/data/categories'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

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
