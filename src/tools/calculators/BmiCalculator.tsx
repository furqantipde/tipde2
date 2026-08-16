import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)

  const calculate = () => {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    if (!h || !w) return

    let result: number
    if (unit === 'metric') {
      result = w / ((h / 100) ** 2)
    } else {
      result = (w / (h ** 2)) * 703
    }
    setBmi(parseFloat(result.toFixed(1)))
  }

  const getCategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600 dark:text-blue-400' }
    if (bmi < 25) return { label: 'Normal weight', color: 'text-green-600 dark:text-green-400' }
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600 dark:text-yellow-400' }
    return { label: 'Obese', color: 'text-red-600 dark:text-red-400' }
  }

  const category = bmi !== null ? getCategory(bmi) : null
  const barPosition = bmi !== null ? Math.min(Math.max((bmi - 10) / 30 * 100, 0), 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant={unit === 'metric' ? 'primary' : 'secondary'} size="sm" onClick={() => { setUnit('metric'); setBmi(null) }}>Metric (kg/cm)</Button>
        <Button variant={unit === 'imperial' ? 'primary' : 'secondary'} size="sm" onClick={() => { setUnit('imperial'); setBmi(null) }}>Imperial (lbs/in)</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          label={`Height (${unit === 'metric' ? 'cm' : 'inches'})`}
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder={unit === 'metric' ? '170' : '67'}
          className="w-32"
        />
        <Input
          label={`Weight (${unit === 'metric' ? 'kg' : 'lbs'})`}
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder={unit === 'metric' ? '70' : '154'}
          className="w-32"
        />
      </div>

      <Button onClick={calculate}>Calculate BMI</Button>

      {bmi !== null && category && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">{bmi}</p>
            <p className={`text-lg font-medium mt-1 ${category.color}`}>{category.label}</p>
          </div>

          {/* BMI Scale */}
          <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500">
            <div
              className="absolute top-0 w-1 h-full bg-gray-900 dark:bg-white"
              style={{ left: `${barPosition}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>10</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40</span>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Underweight:</strong> BMI less than 18.5</p>
            <p><strong>Normal:</strong> BMI 18.5 - 24.9</p>
            <p><strong>Overweight:</strong> BMI 25 - 29.9</p>
            <p><strong>Obese:</strong> BMI 30 or greater</p>
          </div>
        </div>
      )}
    </div>
  )
}
