import { useState } from 'react'
import { Input } from '@/components/ui/Input'

export default function ProfitLossCalculator() {
  const [costPrice, setCostPrice] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')

  const cost = parseFloat(costPrice)
  const selling = parseFloat(sellingPrice)

  const amount = cost && selling ? selling - cost : 0
  const percentage = cost ? (amount / cost) * 100 : 0
  const isProfit = amount >= 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Input
          label="Cost Price"
          type="number"
          min={0}
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          placeholder="100"
          className="w-36"
        />
        <Input
          label="Selling Price"
          type="number"
          min={0}
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          placeholder="120"
          className="w-36"
        />
      </div>

      {cost > 0 && selling > 0 && (
        <div className="space-y-4">
          <div className={`rounded-xl p-6 text-center ${isProfit ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isProfit ? 'Profit' : 'Loss'}
            </p>
            <p className={`text-4xl font-bold mt-1 ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${Math.abs(amount).toFixed(2)}
            </p>
            <p className={`text-lg font-medium mt-1 ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {percentage.toFixed(2)}% {isProfit ? 'profit' : 'loss'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-gray-500 dark:text-gray-400">Margin</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{((amount / selling) * 100).toFixed(2)}%</p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-gray-500 dark:text-gray-400">Markup</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{percentage.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
