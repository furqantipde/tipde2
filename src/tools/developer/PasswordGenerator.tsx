import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { Copy, Check, RefreshCw, Shield, Zap, KeyRound, Hash } from 'lucide-react'

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'il1Lo0O',
  ambiguous: '{}[]()/\\\'"`~,;:.<>',
}

type Preset = 'custom' | 'pin' | 'easy' | 'secure' | 'ultra'

const presets: Record<Preset, { label: string; icon: typeof Zap; length: number; upper: boolean; lower: boolean; numbers: boolean; symbols: boolean; excludeSimilar: boolean }> = {
  custom: { label: 'Custom', icon: KeyRound, length: 16, upper: true, lower: true, numbers: true, symbols: true, excludeSimilar: false },
  pin: { label: 'PIN Code', icon: Hash, length: 6, upper: false, lower: false, numbers: true, symbols: false, excludeSimilar: false },
  easy: { label: 'Easy to Read', icon: Zap, length: 12, upper: true, lower: true, numbers: true, symbols: false, excludeSimilar: true },
  secure: { label: 'Secure', icon: Shield, length: 20, upper: true, lower: true, numbers: true, symbols: true, excludeSimilar: false },
  ultra: { label: 'Ultra Secure', icon: Shield, length: 32, upper: true, lower: true, numbers: true, symbols: true, excludeSimilar: true },
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [customSymbols, setCustomSymbols] = useState('')
  const [bulkCount, setBulkCount] = useState(1)
  const [passwords, setPasswords] = useState<string[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [activePreset, setActivePreset] = useState<Preset>('custom')
  const [history, setHistory] = useState<string[]>([])

  const buildCharset = useCallback(() => {
    let chars = ''
    if (useUppercase) chars += CHAR_SETS.uppercase
    if (useLowercase) chars += CHAR_SETS.lowercase
    if (useNumbers) chars += CHAR_SETS.numbers
    const syms = customSymbols || CHAR_SETS.symbols
    if (useSymbols) chars += syms
    if (excludeSimilar) {
      chars = chars.split('').filter(c => !CHAR_SETS.similar.includes(c)).join('')
    }
    if (excludeAmbiguous) {
      chars = chars.split('').filter(c => !CHAR_SETS.ambiguous.includes(c)).join('')
    }
    return chars
  }, [useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar, excludeAmbiguous, customSymbols])

  const generatePassword = useCallback(() => {
    const chars = buildCharset()
    if (!chars) {
      setPasswords(['Select at least one character type'])
      return
    }
    const results: string[] = []
    for (let b = 0; b < bulkCount; b++) {
      const array = new Uint32Array(length)
      crypto.getRandomValues(array)
      let pwd = Array.from(array, (n) => chars[n % chars.length]).join('')
      // Ensure at least one char from each selected set
      const sets: string[] = []
      if (useUppercase) sets.push(CHAR_SETS.uppercase)
      if (useLowercase) sets.push(CHAR_SETS.lowercase)
      if (useNumbers) sets.push(CHAR_SETS.numbers)
      if (useSymbols) sets.push(customSymbols || CHAR_SETS.symbols)
      for (let s = 0; s < sets.length && s < pwd.length; s++) {
        const setChars = excludeSimilar ? sets[s].split('').filter(c => !CHAR_SETS.similar.includes(c)).join('') : sets[s]
        if (setChars.length > 0) {
          const randIdx = new Uint32Array(1)
          crypto.getRandomValues(randIdx)
          const pos = new Uint32Array(1)
          crypto.getRandomValues(pos)
          pwd = pwd.substring(0, pos[0] % pwd.length) + setChars[randIdx[0] % setChars.length] + pwd.substring((pos[0] % pwd.length) + 1)
        }
      }
      results.push(pwd)
    }
    setPasswords(results)
    setHistory(prev => [...results, ...prev].slice(0, 20))
  }, [length, buildCharset, bulkCount, useUppercase, useLowercase, useNumbers, useSymbols, customSymbols, excludeSimilar])

  const applyPreset = (preset: Preset) => {
    const p = presets[preset]
    setLength(p.length)
    setUseUppercase(p.upper)
    setUseLowercase(p.lower)
    setUseNumbers(p.numbers)
    setUseSymbols(p.symbols)
    setExcludeSimilar(p.excludeSimilar)
    setActivePreset(preset)
    setCustomSymbols('')
  }

  const getStrength = (pwd: string): { label: string; color: string; percent: number } => {
    if (!pwd || pwd.includes('Select')) return { label: '', color: '', percent: 0 }
    let score = 0
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1
    if (pwd.length >= 24) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1
    if (score <= 3) return { label: 'Weak', color: 'bg-red-500', percent: 25 }
    if (score <= 5) return { label: 'Fair', color: 'bg-yellow-500', percent: 50 }
    if (score <= 6) return { label: 'Strong', color: 'bg-green-500', percent: 75 }
    return { label: 'Very Strong', color: 'bg-emerald-500', percent: 100 }
  }

  const copyPassword = async (pwd: string, idx: number) => {
    await navigator.clipboard.writeText(pwd)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const charset = buildCharset()
  const entropy = charset.length > 0 ? Math.round(length * Math.log2(charset.length)) : 0

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(presets) as Preset[]).map((key) => {
            const p = presets[key]
            const Icon = p.icon
            return (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                  activePreset === key
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Length */}
      <Slider label={`Password Length: ${length}`} value={length} min={4} max={128} onChange={(v) => { setLength(v); setActivePreset('custom') }} />

      {/* Character types */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          <input type="checkbox" checked={useUppercase} onChange={(e) => { setUseUppercase(e.target.checked); setActivePreset('custom') }} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Uppercase (A-Z)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          <input type="checkbox" checked={useLowercase} onChange={(e) => { setUseLowercase(e.target.checked); setActivePreset('custom') }} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Lowercase (a-z)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          <input type="checkbox" checked={useNumbers} onChange={(e) => { setUseNumbers(e.target.checked); setActivePreset('custom') }} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Numbers (0-9)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          <input type="checkbox" checked={useSymbols} onChange={(e) => { setUseSymbols(e.target.checked); setActivePreset('custom') }} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Symbols (!@#$)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          <input type="checkbox" checked={excludeSimilar} onChange={(e) => { setExcludeSimilar(e.target.checked); setActivePreset('custom') }} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Exclude similar (i,l,1,L,o,0,O)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => { setExcludeAmbiguous(e.target.checked); setActivePreset('custom') }} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          Exclude ambiguous ({'{}[]()'}...)
        </label>
      </div>

      {/* Custom symbols */}
      {useSymbols && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Symbols (leave empty for default)</label>
          <input
            type="text"
            value={customSymbols}
            onChange={(e) => setCustomSymbols(e.target.value)}
            placeholder="!@#$%^&*"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
      )}

      {/* Bulk count */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Generate Count</label>
          <select
            value={bulkCount}
            onChange={(e) => setBulkCount(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          >
            {[1, 5, 10, 20, 50].map(n => (
              <option key={n} value={n}>{n} password{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <Button onClick={generatePassword} icon={<RefreshCw className="w-4 h-4" />} className="flex-1 sm:flex-none">
          Generate Password{bulkCount > 1 ? 's' : ''}
        </Button>
      </div>

      {/* Results */}
      {passwords.length > 0 && !passwords[0].includes('Select') && (
        <div className="space-y-3">
          {passwords.map((pwd, idx) => {
            const strength = getStrength(pwd)
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3">
                  <code className="flex-1 text-base font-mono text-gray-900 dark:text-gray-100 break-all select-all">{pwd}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyPassword(pwd, idx)} icon={copiedIdx === idx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
                    {copiedIdx === idx ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                {idx === 0 && strength.label && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Strength</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{strength.label}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.percent}%` }} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                      {entropy} bits entropy
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* History */}
      {history.length > passwords.length && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent History</h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {history.slice(passwords.length, 10).map((pwd, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded px-3 py-1.5">
                <span className="flex-1 truncate">{pwd}</span>
                <button onClick={() => copyPassword(pwd, -1)} className="shrink-0 hover:text-primary-600 cursor-pointer">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
