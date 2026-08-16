import { useState } from 'react'
import { Input } from '@/components/ui/Input'

export default function PercentageCalculator() {
  const [val1a, setVal1a] = useState('')
  const [val1b, setVal1b] = useState('')
  const [val2a, setVal2a] = useState('')
  const [val2b, setVal2b] = useState('')
  const [val3a, setVal3a] = useState('')
  const [val3b, setVal3b] = useState('')

  const result1 = val1a && val1b ? ((parseFloat(val1a) / 100) * parseFloat(val1b)).toFixed(2) : ''
  const result2 = val2a && val2b && parseFloat(val2b) !== 0 ? ((parseFloat(val2a) / parseFloat(val2b)) * 100).toFixed(2) : ''
  const result3 = val3a && val3b && parseFloat(val3a) !== 0 ? (((parseFloat(val3b) - parseFloat(val3a)) / parseFloat(val3a)) * 100).toFixed(2) : ''

  return (
    <div className="space-y-8">
      {/* What is X% of Y? */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">What is X% of Y?</h3>
        <div className="flex flex-wrap items-end gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400 pb-2">What is</span>
          <Input value={val1a} onChange={(e) => setVal1a(e.target.value)} placeholder="X" type="number" className="w-24" />
          <span className="text-sm text-gray-600 dark:text-gray-400 pb-2">% of</span>
          <Input value={val1b} onChange={(e) => setVal1b(e.target.value)} placeholder="Y" type="number" className="w-24" />
          <span className="text-sm text-gray-600 dark:text-gray-400 pb-2">?</span>
        </div>
        {result1 && <p className="mt-3 text-lg font-semibold text-primary-600 dark:text-primary-400">= {result1}</p>}
      </div>

      {/* X is what % of Y? */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">X is what % of Y?</h3>
        <div className="flex flex-wrap items-end gap-3">
          <Input value={val2a} onChange={(e) => setVal2a(e.target.value)} placeholder="X" type="number" className="w-24" />
          <span className="text-sm text-gray-600 dark:text-gray-400 pb-2">is what % of</span>
          <Input value={val2b} onChange={(e) => setVal2b(e.target.value)} placeholder="Y" type="number" className="w-24" />
          <span className="text-sm text-gray-600 dark:text-gray-400 pb-2">?</span>
        </div>
        {result2 && <p className="mt-3 text-lg font-semibold text-primary-600 dark:text-primary-400">= {result2}%</p>}
      </div>

      {/* Percentage change from X to Y */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Percentage change from X to Y</h3>
        <div className="flex flex-wrap items-end gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400 pb-2">From</span>
          <Input value={val3a} onChange={(e) => setVal3a(e.target.value)} placeholder="X" type="number" className="w-24" />
          <span className="text-sm text-gray-600 dark:text-gray-400 pb-2">to</span>
          <Input value={val3b} onChange={(e) => setVal3b(e.target.value)} placeholder="Y" type="number" className="w-24" />
        </div>
        {result3 && (
          <p className={`mt-3 text-lg font-semibold ${parseFloat(result3) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            = {parseFloat(result3) >= 0 ? '+' : ''}{result3}% {parseFloat(result3) >= 0 ? 'increase' : 'decrease'}
          </p>
        )}
      </div>
    </div>
  )
}
