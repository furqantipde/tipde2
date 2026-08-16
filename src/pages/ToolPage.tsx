import { Suspense, useEffect, lazy, type ComponentType } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { getToolBySlug } from '@/data/tools'
import { ToolPageLayout } from '@/components/ui/ToolPageLayout'
import { useRecentlyUsed } from '@/hooks/useRecentlyUsed'

// Cache lazy components by tool ID so we don't recreate them on every render
const lazyCache = new Map<string, React.LazyExoticComponent<ComponentType>>()

function getLazyComponent(id: string, loader: () => Promise<{ default: ComponentType }>) {
  let cached = lazyCache.get(id)
  if (!cached) {
    cached = lazy(loader)
    lazyCache.set(id, cached)
  }
  return cached
}

export function ToolPage() {
  const { slug } = useParams<{ slug: string }>()
  const tool = getToolBySlug(slug || '')
  const { addRecentlyUsed } = useRecentlyUsed()

  useEffect(() => {
    if (tool) {
      addRecentlyUsed(tool.id)
      document.title = `${tool.name} — TipdeHub`
      // Update meta description
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', tool.description)
    }
  }, [tool, addRecentlyUsed])

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tool Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The tool you are looking for does not exist.
        </p>
        <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline">
          Go back home
        </Link>
      </div>
    )
  }

  const ToolComponent = getLazyComponent(tool.id, tool.component)

  return (
    <ToolPageLayout tool={tool}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          </div>
        }
      >
        <ToolComponent />
      </Suspense>
    </ToolPageLayout>
  )
}
