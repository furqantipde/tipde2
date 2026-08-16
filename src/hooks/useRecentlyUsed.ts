import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

interface RecentlyUsedItem {
  toolId: string
  timestamp: number
}

const MAX_RECENT = 8

export function useRecentlyUsed() {
  const [recentlyUsed, setRecentlyUsed] = useLocalStorage<RecentlyUsedItem[]>(
    'tipde-recently-used',
    []
  )

  const addRecentlyUsed = useCallback(
    (toolId: string) => {
      setRecentlyUsed((prev) => {
        const filtered = prev.filter((item) => item.toolId !== toolId)
        return [{ toolId, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENT)
      })
    },
    [setRecentlyUsed]
  )

  const getRecentToolIds = useCallback(() => recentlyUsed.map((item) => item.toolId), [recentlyUsed])

  return { recentlyUsed, addRecentlyUsed, getRecentToolIds }
}
