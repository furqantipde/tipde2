import { useNavigate } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import { useRecentlyUsed } from '@/hooks/useRecentlyUsed'
import { tools } from '@/data/tools'
import { Card } from '@/components/ui/Card'

export function RecentlyUsed() {
  const navigate = useNavigate()
  const { getRecentToolIds } = useRecentlyUsed()
  const recentIds = getRecentToolIds()
  const recentTools = recentIds
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 4)

  if (recentTools.length === 0) return null

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recently Used</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentTools.map((tool) => (
            <Card
              key={tool!.id}
              hoverable
              onClick={() => navigate(`/tools/${tool!.slug}`)}
              className="group"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {tool!.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {tool!.description}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-primary-600 dark:text-primary-400">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
