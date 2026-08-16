import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Copy, Check, AlertCircle } from 'lucide-react'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const validate = () => {
    try {
      JSON.parse(input)
      setOutput('Valid JSON!')
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

  const useOutputAsInput = () => {
    if (output && output !== 'Valid JSON!') {
      setInput(output)
      setOutput('')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input JSON</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError('') }}
          placeholder='Paste your JSON here, e.g. {"name": "John", "age": 30}'
          className="w-full h-40 rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={format}>Format</Button>
        <Button variant="secondary" onClick={minify}>Minify</Button>
        <Button variant="outline" onClick={validate}>Validate</Button>
        {output && output !== 'Valid JSON!' && (
          <>
            <Button variant="outline" onClick={copyResult} icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="ghost" onClick={useOutputAsInput}>Use as Input</Button>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Invalid JSON</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-1 font-mono">{error}</p>
          </div>
        </div>
      )}

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output</label>
          <textarea
            readOnly
            value={output}
            className={`w-full h-48 rounded-lg border p-4 font-mono text-sm resize-y ${
              output === 'Valid JSON!'
                ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
            }`}
          />
        </div>
      )}
    </div>
  )
}
