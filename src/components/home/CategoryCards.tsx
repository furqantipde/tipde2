import { useNavigate } from 'react-router-dom'
import {
  Image,
  FileText,
  Calculator,
  Code,
  Bot,
  FolderOpen,
  Sparkles,
  Type,
} from 'lucide-react'
import { categories } from '@/data/categories'
import { getToolsByCategory } from '@/data/tools'
import { Card } from '@/components/ui/Card'

const iconMap: Record<string, React.ReactNode> = {
  Image: <Image className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Bot: <Bot className="w-6 h-6" />,
  FolderOpen: <FolderOpen className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Type: <Type className="w-6 h-6" />,
}

export function CategoryCards() {
  const navigate = useNavigate()

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const toolCount = getToolsByCategory(cat.id).length
            return (
              <Card
                key={cat.id}
                hoverable
                onClick={() => navigate(`/category/${cat.id}`)}
                className="flex flex-col items-start gap-3"
              >
                <div className={`p-3 rounded-lg ${cat.color}`}>
                  {iconMap[cat.icon] || <Code className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{cat.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cat.description}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-2">
                    {toolCount}+ tools
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
