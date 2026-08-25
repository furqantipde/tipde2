import { Link } from 'react-router-dom'
import { categories } from '@/data/categories'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Tipde<span className="text-gray-900 dark:text-gray-100">Hub</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              100+ free online tools for everyday work. Fast, private, and browser-based.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">More Categories</h3>
            <ul className="space-y-2">
              {categories.slice(4).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  About
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  User Reviews
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} TipdeHub. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made by <span className="font-medium text-gray-700 dark:text-gray-300">M.Furqan</span>, CEO of Tipde
          </p>
        </div>
      </div>
    </footer>
  )
}
