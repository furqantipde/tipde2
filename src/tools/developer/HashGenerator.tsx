import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Copy, Check, RefreshCw } from 'lucide-react'

type Algo = 'SHA-256' | 'SHA-1' | 'SHA-512' | 'SHA-384'

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState<Algo>('SHA-256')
  const [hash, setHash] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const algoMap: Record<Algo, string> = { 'SHA-256': 'SHA-256', 'SHA-1': 'SHA-1', 'SHA-512': 'SHA-512', 'SHA-384': 'SHA-384' }
    const hashBuffer = await crypto.subtle.digest(algoMap[algorithm], data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    setHash(hashHex)
  }

  const generateAll = async () => {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const results: string[] = []
    for (const algo of ['SHA-256', 'SHA-1', 'SHA-512', 'SHA-384'] as const) {
      const buf = await crypto.subtle.digest(algo, data)
      const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
      results.push(`${algo}: ${hex}`)
    }
    setHash(results.join('\n'))
  }

  const copy = async () => {
    await navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input Text</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to hash..." rows={4} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-y" />
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <Select label="Algorithm" value={algorithm} onChange={(e) => setAlgorithm(e.target.value as Algo)} options={[
          { value: 'SHA-256', label: 'SHA-256' },
          { value: 'SHA-1', label: 'SHA-1' },
          { value: 'SHA-512', label: 'SHA-512' },
          { value: 'SHA-384', label: 'SHA-384' },
        ]} className="w-36" />
        <Button onClick={generate} icon={<RefreshCw className="w-4 h-4" />}>Generate Hash</Button>
        <Button variant="outline" onClick={generateAll}>All Algorithms</Button>
      </div>

      {hash && (
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
            <code className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all whitespace-pre-wrap">{hash}</code>
          </div>
          <Button onClick={copy} icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      )}
    </div>
  )
}
