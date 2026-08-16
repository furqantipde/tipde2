import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { Copy, Check, RefreshCw } from 'lucide-react'

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const generatePassword = useCallback(() => {
    let chars = ''
    if (useUppercase) chars += CHAR_SETS.uppercase
    if (useLowercase) chars += CHAR_SETS.lowercase
    if (useNumbers) chars += CHAR_SETS.numbers
    if (useSymbols) chars += CHAR_SETS.symbols

    if (!chars) {
      setPassword('Select at least one character type')
      return
    }

    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    const result = Array.from(array, (n) => chars[n % chars.length]).join('')
    setPassword(result)
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols])

  const getStrength = (): { label: string; color: string; percent: number } => {
    if (!password || password.includes('Select')) return { label: '', color: '', percent: 0 }
    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (password.length >= 16) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', percent: 25 }
    if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500', percent: 50 }
    if (score <= 5) return { label: 'Strong', color: 'bg-green-500', percent: 75 }
    return { label: 'Very Strong', color: 'bg-emerald-500', percent: 100 }
  }

  const copyPassword = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strength = getStrength()

  return (
    <div className="space-y-6">
      <Slider
        label="Password Length"
        value={length}
        min={4}
        max={64}
        onChange={setLength}
      />

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Uppercase (A-Z)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input type="checkbox" checked={useLowercase} onChange={(e) => setUseLowercase(e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Lowercase (a-z)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Numbers (0-9)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Symbols (!@#$)
        </label>
      </div>

      <Button onClick={generatePassword} icon={<RefreshCw className="w-4 h-4" />}>
        Generate Password
      </Button>

      {password && !password.includes('Select') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
            <code className="flex-1 text-lg font-mono text-gray-900 dark:text-gray-100 break-all">{password}</code>
            <Button variant="ghost" size="sm" onClick={copyPassword} icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          {strength.label && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Strength</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{strength.label}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.percent}%` }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
