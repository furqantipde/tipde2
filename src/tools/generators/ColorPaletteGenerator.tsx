import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { RefreshCw, Lock, Unlock, Copy, Check } from 'lucide-react'

function randomHsl(): string {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 40) + 50
  const l = Math.floor(Math.random() * 30) + 40
  return `hsl(${h}, ${s}%, ${l}%)`
}

function hslToHex(hsl: string): string {
  const el = document.createElement('div')
  el.style.color = hsl
  document.body.appendChild(el)
  const computed = getComputedStyle(el).color
  document.body.removeChild(el)
  const match = computed.match(/\d+/g)
  if (!match) return '#000000'
  return '#' + match.slice(0, 3).map((n) => parseInt(n).toString(16).padStart(2, '0')).join('')
}

function hslToRgb(hsl: string): string {
  const el = document.createElement('div')
  el.style.color = hsl
  document.body.appendChild(el)
  const computed = getComputedStyle(el).color
  document.body.removeChild(el)
  return computed
}

interface ColorItem {
  hsl: string
  locked: boolean
}

export default function ColorPaletteGenerator() {
  const [colors, setColors] = useState<ColorItem[]>(() =>
    Array.from({ length: 5 }, () => ({ hsl: randomHsl(), locked: false }))
  )
  const [copiedIndex, setCopiedIndex] = useState(-1)

  const generate = useCallback(() => {
    setColors((prev) =>
      prev.map((c) => (c.locked ? c : { hsl: randomHsl(), locked: false }))
    )
  }, [])

  const toggleLock = (index: number) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    )
  }

  const copyHex = async (hsl: string, index: number) => {
    const hex = hslToHex(hsl)
    await navigator.clipboard.writeText(hex)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(-1), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button onClick={generate} icon={<RefreshCw className="w-4 h-4" />}>
          Generate Palette
        </Button>
        <span className="text-sm text-gray-400 dark:text-gray-500 self-center">
          Press Space to generate
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3 h-48 sm:h-64">
        {colors.map((color, i) => {
          const hex = hslToHex(color.hsl)
          const rgb = hslToRgb(color.hsl)
          return (
            <div
              key={i}
              className="relative rounded-xl flex flex-col items-center justify-end pb-4 cursor-pointer group overflow-hidden"
              style={{ backgroundColor: color.hsl }}
              onClick={() => toggleLock(i)}
              onKeyDown={(e) => { if (e.key === ' ') { e.preventDefault(); generate() } }}
              tabIndex={0}
            >
              {color.locked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-white/80" />
                </div>
              )}
              {!color.locked && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Unlock className="w-4 h-4 text-white/60" />
                </div>
              )}
              <div className="text-center">
                <p className="text-xs font-mono font-bold text-white/90 bg-black/20 rounded px-1.5 py-0.5">{hex}</p>
                <p className="text-[10px] text-white/70 mt-1">{rgb}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); copyHex(color.hsl, i) }}
                className="absolute top-2 left-2 p-1 rounded bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {copiedIndex === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-gray-500">
        Click a color to lock/unlock it. Click the copy icon to copy the hex value.
      </p>
    </div>
  )
}
