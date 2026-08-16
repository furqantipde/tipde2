import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Copy, Check } from 'lucide-react'

export default function Base64Encoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
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

  const swap = () => {
    setInput(output)
    setOutput('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === 'encode' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setMode('encode')}
        >
          Encode
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setMode('decode')}
        >
          Decode
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError('') }}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
          className="w-full h-32 rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={process}>
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </Button>
        {output && (
          <>
            <Button variant="outline" onClick={copyResult} icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
              {copied ? 'Copied!' : 'Copy Result'}
            </Button>
            <Button variant="ghost" onClick={swap}>Swap</Button>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
          </label>
          <textarea
            readOnly
            value={output}
            className="w-full h-32 rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 resize-y"
          />
        </div>
      )}
    </div>
  )
}
