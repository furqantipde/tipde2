import { useState } from 'react'

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Preview

## Features
- **Bold text** and *italic text*
- [Links](https://example.com)
- Inline \`code\` blocks

### Lists
1. First item
2. Second item
3. Third item

> This is a blockquote

---

| Feature | Status |
|---------|--------|
| Bold | ✅ |
| Italic | ✅ |
| Links | ✅ |

\`\`\`
code block here
\`\`\`
`)

  const renderMarkdown = (md: string): string => {
    let html = md
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto text-sm font-mono my-2"><code>$1</code></pre>')
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h1>')
    // Bold & italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 dark:text-primary-400 underline" target="_blank" rel="noopener">$1</a>')
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary-500 pl-4 py-1 my-2 text-gray-600 dark:text-gray-400 italic">$1</blockquote>')
    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr class="my-4 border-gray-200 dark:border-gray-700" />')
    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300">$1</li>')
    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700 dark:text-gray-300">$1</li>')
    // Tables (simple)
    html = html.replace(/\|(.+)\|/g, (match) => {
      if (match.includes('---')) return ''
      const cells = match.split('|').filter(c => c.trim())
      const tds = cells.map(c => `<td class="border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm">${c.trim()}</td>`).join('')
      return `<tr>${tds}</tr>`
    })
    // Paragraphs
    html = html.replace(/^(?!<[hluobpt]|<li|<hr|<pre|<tr)(.+)$/gm, '<p class="my-1 text-gray-700 dark:text-gray-300">$1</p>')
    return html
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
        {/* Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Markdown</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-[500px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono p-4 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none"
            spellCheck={false}
          />
        </div>
        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview</label>
          <div
            className="w-full h-[500px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 overflow-y-auto prose-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
          />
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {markdown.length} characters · {markdown.split(/\s+/).filter(Boolean).length} words
      </div>
    </div>
  )
}
