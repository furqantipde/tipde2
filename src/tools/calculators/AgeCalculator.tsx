import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/Input'

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('')

  const age = useMemo(() => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    const now = new Date()
    if (birth > now) return null

    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60

    // Next birthday
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1)
    const daysToNextBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return { years, months, days, totalDays, totalHours, totalMinutes, daysToNextBday }
  }, [birthDate])

  return (
    <div className="space-y-6">
      <Input
        label="Date of Birth"
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        max={new Date().toISOString().split('T')[0]}
        className="w-48"
      />

      {age && (
        <div className="space-y-4">
          <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {age.years} years, {age.months} months, {age.days} days
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatBox label="Total Days" value={age.totalDays.toLocaleString()} />
            <StatBox label="Total Hours" value={age.totalHours.toLocaleString()} />
            <StatBox label="Total Minutes" value={age.totalMinutes.toLocaleString()} />
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Next Birthday In</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">{age.daysToNextBday} days</p>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  )
}
