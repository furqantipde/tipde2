import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type FromUnit = 'celsius' | 'fahrenheit' | 'kelvin'

const units = [
  { value: 'celsius', label: '°C Celsius' },
  { value: 'fahrenheit', label: '°F Fahrenheit' },
  { value: 'kelvin', label: 'K Kelvin' },
]

function convert(value: number, from: FromUnit, to: FromUnit): number {
  // Convert to Celsius first
  let c: number
  if (from === 'celsius') c = value
  else if (from === 'fahrenheit') c = (value - 32) * 5 / 9
  else c = value - 273.15
  // Convert from Celsius to target
  if (to === 'celsius') return c
  if (to === 'fahrenheit') return c * 9 / 5 + 32
  return c + 273.15
}

export default function TemperatureConverter() {
  const [value, setValue] = useState(100)
  const [from, setFrom] = useState<FromUnit>('celsius')

  const results = units.filter(u => u.value !== from).map(u => ({
    label: u.label,
    value: convert(value, from, u.value as FromUnit),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value as FromUnit)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
            {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.map((r) => (
          <div key={r.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{r.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {r.value.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Reference table */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Common References</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Description</th>
                <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">°C</th>
                <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">°F</th>
                <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">K</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {[
                ['Water boils', 100, 212, 373.15],
                ['Human body', 37, 98.6, 310.15],
                ['Room temp', 22, 71.6, 295.15],
                ['Water freezes', 0, 32, 273.15],
                ['Absolute zero', -273.15, -459.67, 0],
              ].map(([label, c, f, k]) => (
                <tr key={label as string} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-3">{label}</td>
                  <td className="text-center py-2 px-3">{c}</td>
                  <td className="text-center py-2 px-3">{f}</td>
                  <td className="text-center py-2 px-3">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
