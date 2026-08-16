import { useNavigate } from 'react-router-dom'
import { Flame, ArrowRight } from 'lucide-react'
import { getPopularTools } from '@/data/tools'
import { Card } from '@/components/ui/Card'

export function PopularTools() {
  const navigate = useNavigate()
  const popular = getPopularTools()

  if (popular.length === 0) return null

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Flame className="w-5 h-5 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Popular Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((tool) => (
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
      </div>
    </section>
  )
}
