import type { Tool } from '@/types/tool'

export function searchTools(query: string, allTools: Tool[]): Tool[] {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()
  const terms = q.split(/\s+/)

  return allTools
    .map((tool) => {
      let score = 0
      const nameLower = tool.name.toLowerCase()
      const descLower = tool.description.toLowerCase()

      for (const term of terms) {
        // Name match (highest priority)
        if (nameLower.includes(term)) score += 10
        if (nameLower === term) score += 20
        // Keyword match
        if (tool.keywords.some((kw) => kw.toLowerCase().includes(term))) score += 5
        // Description match
        if (descLower.includes(term)) score += 2
      }

      return { tool, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ tool }) => tool)
}
