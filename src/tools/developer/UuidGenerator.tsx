import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Copy, Check, RefreshCw } from 'lucide-react'

export default function UuidGenerator() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState(-1)
  const [copiedAll, setCopiedAll] = useState(false)
  const [uppercase, setUppercase] = useState(false)

  const generateUuid = (): string => {
    return crypto.randomUUID()
  }

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => {
      const uuid = generateUuid()
      return uppercase ? uuid.toUpperCase() : uuid
    })
    setUuids(newUuids)
  }

  const copySingle = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(-1), 1500)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <Input
          label="Count"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
          className="w-24"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer pb-2">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Uppercase
        </label>
        <Button onClick={generate} icon={<RefreshCw className="w-4 h-4" />}>
          Generate
        </Button>
        {uuids.length > 0 && (
          <Button variant="outline" onClick={copyAll} icon={copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
            {copiedAll ? 'Copied All!' : 'Copy All'}
          </Button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <code className="text-sm font-mono text-gray-900 dark:text-gray-100">{uuid}</code>
              <button
                onClick={() => copySingle(uuid, i)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {copiedIndex === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {uuids.length === 0 && (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          Click Generate to create UUIDs
        </div>
      )}
    </div>
  )
}
