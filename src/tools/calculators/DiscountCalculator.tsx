import { useState } from 'react'
import { Input } from '@/components/ui/Input'

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')

  const original = parseFloat(originalPrice)
  const discount = parseFloat(discountPercent)

  const savings = original && discount ? (original * discount) / 100 : 0
  const finalPrice = original ? original - savings : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Input
          label="Original Price"
          type="number"
          min={0}
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          placeholder="100"
          className="w-36"
        />
        <Input
          label="Discount (%)"
          type="number"
          min={0}
          max={100}
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
          placeholder="20"
          className="w-36"
        />
      </div>

      {original > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Final Price</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">${finalPrice.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">You Save</p>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-1">${savings.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Original Price</p>
            <p className="text-xl font-medium text-gray-400 line-through mt-2">${original.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
