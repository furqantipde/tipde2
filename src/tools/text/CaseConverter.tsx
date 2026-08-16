import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Copy, Check } from 'lucide-react'

export default function CaseConverter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = (fn: (s: string) => string) => setText(fn(text))

  const toUpperCase = () => convert((s) => s.toUpperCase())
  const toLowerCase = () => convert((s) => s.toLowerCase())
  const toTitleCase = () =>
    convert((s) =>
      s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    )
  const toSentenceCase = () =>
    convert((s) =>
      s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase())
    )
  const toAlternatingCase = () =>
    convert((s) =>
      s
        .split('')
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join('')
    )
  const toInverseCase = () =>
    convert((s) =>
      s
        .split('')
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join('')
    )

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter or paste your text here..."
        className="w-full h-40 rounded-lg border border-gray-300 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={toUpperCase}>UPPERCASE</Button>
        <Button variant="secondary" size="sm" onClick={toLowerCase}>lowercase</Button>
        <Button variant="secondary" size="sm" onClick={toTitleCase}>Title Case</Button>
        <Button variant="secondary" size="sm" onClick={toSentenceCase}>Sentence case</Button>
        <Button variant="secondary" size="sm" onClick={toAlternatingCase}>aLtErNaTiNg</Button>
        <Button variant="secondary" size="sm" onClick={toInverseCase}>iNVERSE</Button>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  )
}
