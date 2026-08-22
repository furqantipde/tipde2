import { useState } from 'react'

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(8)
  const [tenure, setTenure] = useState(5)
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years')

  const months = tenureType === 'years' ? tenure * 12 : tenure
  const monthlyRate = rate / 12 / 100

  let emi = 0
  let totalPayment = 0
  let totalInterest = 0

  if (principal > 0 && rate > 0 && months > 0) {
    if (monthlyRate === 0) {
      emi = principal / months
    } else {
      emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
    }
    totalPayment = emi * months
    totalInterest = totalPayment - principal
  }

  const formatCurrency = (n: number) => n.toLocaleString('en-PK', { maximumFractionDigits: 0 })

  // Amortization schedule (first 12 months + last month)
  const schedule: { month: number; emi: number; principal: number; interest: number; balance: number }[] = []
  if (emi > 0) {
    let balance = principal
    const showMonths = Math.min(months, 12)
    for (let i = 1; i <= showMonths; i++) {
      const interestPart = balance * monthlyRate
      const principalPart = emi - interestPart
      balance -= principalPart
      schedule.push({ month: i, emi, principal: principalPart, interest: interestPart, balance: Math.max(0, balance) })
    }
  }

  const principalPercent = totalPayment > 0 ? (principal / totalPayment) * 100 : 0
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loan Amount</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interest Rate (% per year)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tenure</label>
          <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tenure Type</label>
          <select value={tenureType} onChange={(e) => setTenureType(e.target.value as 'years' | 'months')} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
            <option value="years">Years</option>
            <option value="months">Months</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-5 text-center">
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">Monthly EMI</p>
          <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{formatCurrency(emi)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Interest</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalInterest)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Payment</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalPayment)}</p>
        </div>
      </div>

      {/* Breakdown bar */}
      {totalPayment > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Principal: {principalPercent.toFixed(1)}%</span>
            <span>Interest: {interestPercent.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
            <div className="h-full bg-primary-500 transition-all" style={{ width: `${principalPercent}%` }} />
            <div className="h-full bg-red-500 transition-all" style={{ width: `${interestPercent}%` }} />
          </div>
        </div>
      )}

      {/* Amortization schedule */}
      {schedule.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Schedule (First 12 months)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Month</th>
                  <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">EMI</th>
                  <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Principal</th>
                  <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Interest</th>
                  <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {schedule.map((row) => (
                  <tr key={row.month} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-3">{row.month}</td>
                    <td className="text-right py-2 px-3">{formatCurrency(row.emi)}</td>
                    <td className="text-right py-2 px-3 text-primary-600 dark:text-primary-400">{formatCurrency(row.principal)}</td>
                    <td className="text-right py-2 px-3 text-red-600 dark:text-red-400">{formatCurrency(row.interest)}</td>
                    <td className="text-right py-2 px-3">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
