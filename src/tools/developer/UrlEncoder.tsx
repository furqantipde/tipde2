import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Copy, Check } from 'lucide-react'

export default function UrlEncoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const copyResult = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant={mode === 'encode' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('encode')}>
          Encode
        </Button>
        <Button variant={mode === 'decode' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('decode')}>
          Decode
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {mode === 'encode' ? 'URL or Text' : 'Encoded URL'}
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError('') }}
          placeholder={mode === 'encode' ? 'e.g., https://example.com/path?q=hello world' : 'e.g., https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello%20world'}
          className="w-full h-32 rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={process}>{mode === 'encode' ? 'Encode URL' : 'Decode URL'}</Button>
        {output && (
          <Button variant="outline" onClick={copyResult} icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {output && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Result</p>
          <p className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">{output}</p>
        </div>
      )}
    </div>
  )
}
