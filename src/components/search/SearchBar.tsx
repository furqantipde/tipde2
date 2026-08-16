import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { tools } from '@/data/tools'
import { searchTools } from '@/utils/search'
import type { Tool } from '@/types/tool'

interface SearchBarProps {
  onClose?: () => void
  large?: boolean
}

export function SearchBar({ onClose, large = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Tool[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setResults(searchTools(query, tools))
    setSelectedIndex(-1)
  }, [query])

  const handleSelect = (tool: Tool) => {
    navigate(`/tools/${tool.slug}`)
    onClose?.()
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      onClose?.()
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
      <div className="flex items-center px-4">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${tools.length}+ tools...`}
          className={`w-full bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500 ${large ? 'py-4 text-base' : 'py-3 text-sm'} px-3`}
        />
      </div>

      {results.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 max-h-64 overflow-y-auto">
          {results.slice(0, 8).map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => handleSelect(tool)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors cursor-pointer ${
                index === selectedIndex
                  ? 'bg-primary-50 dark:bg-primary-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{tool.name}</span>
              <span className="text-xs text-gray-400 truncate">{tool.description}</span>
            </button>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No tools found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  )
}
