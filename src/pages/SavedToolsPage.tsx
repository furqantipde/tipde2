import { Link } from 'react-router-dom'
import { Heart, Trash2, ArrowRight } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { tools } from '@/data/tools'
import { Button } from '@/components/ui/Button'

export function SavedToolsPage() {
  const { favorites, toggleFavorite } = useFavorites()
  const savedTools = tools.filter((t) => favorites.includes(t.id))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            Saved Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {savedTools.length === 0
              ? 'You haven\'t saved any tools yet.'
              : `${savedTools.length} tool${savedTools.length > 1 ? 's' : ''} saved`}
          </p>
        </div>
        {savedTools.length > 0 && (
          <Link to="/" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
            Browse all tools <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {savedTools.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No saved tools yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Browse our tools and click the heart icon on any tool to save it here for quick access.
          </p>
          <Link to="/">
            <Button>Explore Tools</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedTools.map((tool) => (
            <div
              key={tool.id}
              className="group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFavorite(tool.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 cursor-pointer"
                title="Remove from saved"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <Link to={`/tools/${tool.slug}`} className="block">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg shrink-0">
                    {tool.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{tool.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {tool.description}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
