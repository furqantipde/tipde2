import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Copy, Check } from 'lucide-react'

export default function SlugGenerator() {
  const [text, setText] = useState('')
  const [separator, setSeparator] = useState('-')
  const [lowercase, setLowercase] = useState(true)
  const [copied, setCopied] = useState(false)

  const generateSlug = (input: string): string => {
    let slug = input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-zA-Z0-9\s\-_.]/g, '') // Remove special chars
      .trim()
      .replace(/\s+/g, separator) // Replace spaces with separator

    if (lowercase) slug = slug.toLowerCase()
    return slug
  }

  const slug = generateSlug(text)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Input
        label="Enter text or title"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g., My Amazing Blog Post Title"
      />

      <div className="flex flex-wrap gap-4">
        <Select
          label="Separator"
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
          options={[
            { value: '-', label: 'Hyphen (-)' },
            { value: '_', label: 'Underscore (_)' },
            { value: '.', label: 'Dot (.)' },
          ]}
          className="w-40"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer pt-7">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Lowercase
        </label>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Generated Slug</p>
        <p className="text-lg font-mono text-primary-600 dark:text-primary-400 break-all">
          {slug || 'your-slug-will-appear-here'}
        </p>
      </div>

      {slug && (
        <Button
          variant="outline"
          onClick={copyToClipboard}
          icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        >
          {copied ? 'Copied!' : 'Copy Slug'}
        </Button>
      )}
    </div>
  )
}
