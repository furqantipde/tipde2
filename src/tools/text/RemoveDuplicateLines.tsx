import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Copy, Check, Trash2 } from 'lucide-react'

export default function RemoveDuplicateLines() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [trimLines, setTrimLines] = useState(true)
  const [copied, setCopied] = useState(false)

  const removeDuplicates = () => {
    const lines = text.split('\n')
    const seen = new Set<string>()
    const unique: string[] = []

    for (const line of lines) {
      const key = trimLines ? line.trim() : line
      const lookupKey = caseSensitive ? key : key.toLowerCase()
      if (!seen.has(lookupKey)) {
        seen.add(lookupKey)
        unique.push(trimLines ? key : line)
      }
    }

    setResult(unique.join('\n'))
  }

  const copyResult = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const originalCount = text.split('\n').filter((l) => l.trim()).length
  const uniqueCount = result ? result.split('\n').filter((l) => l.trim()).length : 0
  const removedCount = originalCount - uniqueCount

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setResult('')
        }}
        placeholder="Paste text with duplicate lines here..."
        className="w-full h-40 rounded-lg border border-gray-300 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
      />

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Case sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Trim whitespace
        </label>
      </div>

      <div className="flex gap-2">
        <Button onClick={removeDuplicates}>Remove Duplicates</Button>
        {result && (
          <>
            <Button variant="outline" onClick={copyResult} icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
              {copied ? 'Copied!' : 'Copy Result'}
            </Button>
            <Button variant="ghost" onClick={() => { setText(result); setResult('') }} icon={<Trash2 className="w-4 h-4" />}>
              Use as Input
            </Button>
          </>
        )}
      </div>

      {result && (
        <div className="space-y-3">
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Original: <strong className="text-gray-900 dark:text-gray-100">{originalCount}</strong> lines</span>
            <span>Unique: <strong className="text-green-600 dark:text-green-400">{uniqueCount}</strong> lines</span>
            <span>Removed: <strong className="text-red-600 dark:text-red-400">{removedCount}</strong> duplicates</span>
          </div>
          <textarea
            readOnly
            value={result}
            className="w-full h-40 rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 resize-y"
          />
        </div>
      )}
    </div>
  )
}
