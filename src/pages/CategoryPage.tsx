import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getCategoryById } from '@/data/categories'
import { getToolsByCategory } from '@/data/tools'
import { Card } from '@/components/ui/Card'

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const category = getCategoryById(categoryId || '')
  const tools = getToolsByCategory(categoryId || '')

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Category Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The category you are looking for does not exist.</p>
        <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline">
          Go back home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{category.description}</p>
      </div>

      {tools.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">Tools in this category are coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              hoverable
              onClick={() => navigate(`/tools/${tool.slug}`)}
              className="group"
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {tool.description}
              </p>
              <div className="flex items-center gap-1 mt-3 text-sm text-primary-600 dark:text-primary-400 font-medium">
                Open tool <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
