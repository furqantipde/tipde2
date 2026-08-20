import { useState, useRef, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Download, Upload, Palette, Square, Circle, Diamond, Hexagon } from 'lucide-react'

// ── Theme presets ──
interface Theme {
  name: string
  fg: string
  bg: string
  label: string
}

const themes: Theme[] = [
  { name: 'classic',    fg: '#000000', bg: '#ffffff', label: 'Classic' },
  { name: 'ocean',      fg: '#0369a1', bg: '#e0f2fe', label: 'Ocean' },
  { name: 'sunset',     fg: '#c2410c', bg: '#fff7ed', label: 'Sunset' },
  { name: 'forest',     fg: '#15803d', bg: '#f0fdf4', label: 'Forest' },
  { name: 'royal',      fg: '#7c3aed', bg: '#f5f3ff', label: 'Royal' },
  { name: 'rose',       fg: '#be123c', bg: '#fff1f2', label: 'Rose' },
  { name: 'neon',       fg: '#22d3ee', bg: '#0f172a', label: 'Neon' },
  { name: 'midnight',   fg: '#e2e8f0', bg: '#1e293b', label: 'Midnight' },
  { name: 'mono-blue',  fg: '#1e3a5f', bg: '#dbeafe', label: 'Mono Blue' },
  { name: 'mono-red',   fg: '#7f1d1d', bg: '#fee2e2', label: 'Mono Red' },
  { name: 'pastel',     fg: '#a78bfa', bg: '#fef3c7', label: 'Pastel' },
  { name: 'earth',      fg: '#78350f', bg: '#fef9c3', label: 'Earth' },
  { name: 'cyber',      fg: '#d946ef', bg: '#0c0a09', label: 'Cyber' },
  { name: 'invert',     fg: '#ffffff', bg: '#000000', label: 'Inverted' },
]

// ── Dot styles ──
type DotStyle = 'square' | 'rounded' | 'dots' | 'diamond'

const dotStyleOptions = [
  { value: 'square',  label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots',    label: 'Dots' },
  { value: 'diamond', label: 'Diamond' },
]

// ── Error correction levels ──
type ECLevel = 'L' | 'M' | 'Q' | 'H'

const ecOptions = [
  { value: 'L', label: 'Low (7%)' },
  { value: 'M', label: 'Medium (15%)' },
  { value: 'Q', label: 'Quartile (25%)' },
  { value: 'H', label: 'High (30%)' },
]

export default function QrGenerator() {
  const [text, setText] = useState('https://tipde.online')
  const [size, setSize] = useState(300)
  const [format, setFormat] = useState<'png' | 'svg'>('png')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [ecLevel, setEcLevel] = useState<ECLevel>('H')
  const [margin, setMargin] = useState(2)
  const [dotStyle, setDotStyle] = useState<DotStyle>('square')
  const [activeTheme, setActiveTheme] = useState('classic')
  const [logo, setLogo] = useState<HTMLImageElement | null>(null)
  const [logoSize, setLogoSize] = useState(20)
  const [showCustomColors, setShowCustomColors] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Apply a theme preset
  const applyTheme = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName)
    if (theme) {
      setFgColor(theme.fg)
      setBgColor(theme.bg)
      setActiveTheme(themeName)
      setShowCustomColors(false)
    }
  }

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => setLogo(img)
    img.src = URL.createObjectURL(file)
  }

  // Draw a single module based on dot style
  const drawModule = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number, moduleSize: number,
    style: DotStyle
  ) => {
    const s = moduleSize
    const cx = x + s / 2
    const cy = y + s / 2

    switch (style) {
      case 'square':
        ctx.fillRect(x, y, s, s)
        break

      case 'rounded': {
        const r = s * 0.3
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + s - r, y)
        ctx.quadraticCurveTo(x + s, y, x + s, y + r)
        ctx.lineTo(x + s, y + s - r)
        ctx.quadraticCurveTo(x + s, y + s, x + s - r, y + s)
        ctx.lineTo(x + r, y + s)
        ctx.quadraticCurveTo(x, y + s, x, y + s - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
        ctx.fill()
        break
      }

      case 'dots':
        ctx.beginPath()
        ctx.arc(cx, cy, s * 0.42, 0, Math.PI * 2)
        ctx.fill()
        break

      case 'diamond':
        ctx.beginPath()
        ctx.moveTo(cx, y)
        ctx.lineTo(x + s, cy)
        ctx.lineTo(cx, y + s)
        ctx.lineTo(x, cy)
        ctx.closePath()
        ctx.fill()
        break
    }
  }

  // Draw the QR code with custom rendering
  const renderQR = useCallback(async () => {
    if (!text || !canvasRef.current) return
    const canvas = canvasRef.current

    try {
      // Get the QR matrix data
      const qrData = QRCode.create(text, { errorCorrectionLevel: ecLevel })
      const modules = qrData.modules
      const moduleCount = modules.size
      const moduleSize = size / (moduleCount + margin * 2)
      const offset = moduleSize * margin
      const totalSize = size

      canvas.width = totalSize
      canvas.height = totalSize

      const ctx = canvas.getContext('2d')!
      // Clear canvas
      ctx.clearRect(0, 0, totalSize, totalSize)

      // Draw background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, totalSize, totalSize)

      // Draw modules
      ctx.fillStyle = fgColor
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (modules.get(row, col)) {
            const x = offset + col * moduleSize
            const y = offset + row * moduleSize
            drawModule(ctx, x, y, moduleSize, dotStyle)
          }
        }
      }

      // Draw logo overlay
      if (logo) {
        const logoW = (logoSize / 100) * totalSize
        const logoH = (logoSize / 100) * totalSize
        const logoX = (totalSize - logoW) / 2
        const logoY = (totalSize - logoH) / 2

        // White background behind logo
        const pad = 4
        ctx.fillStyle = bgColor
        ctx.fillRect(logoX - pad, logoY - pad, logoW + pad * 2, logoH + pad * 2)

        // Draw logo
        ctx.drawImage(logo, logoX, logoY, logoW, logoH)
      }
    } catch {
      // fallback to simple render
      QRCode.toCanvas(canvas, text, {
        width: size,
        margin,
        errorCorrectionLevel: ecLevel,
        color: { dark: fgColor, light: bgColor },
      }).catch(() => {})
    }
  }, [text, size, fgColor, bgColor, ecLevel, margin, dotStyle, logo, logoSize])

  useEffect(() => {
    renderQR()
  }, [renderQR])

  // Download
  const download = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `qrcode-${activeTheme}.${format}`
    link.href = canvasRef.current.toDataURL(`image/${format === 'png' ? 'png' : 'png'}`)
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Text input */}
      <Input
        label="Text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text, URL, email, phone, or WiFi info"
      />

      {/* Theme presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Palette className="w-4 h-4" />
            Theme Presets
          </label>
          <button
            onClick={() => setShowCustomColors(!showCustomColors)}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            {showCustomColors ? 'Hide colors' : 'Custom colors'}
          </button>
        </div>
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => applyTheme(theme.name)}
              title={theme.label}
              className={`group relative w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                activeTheme === theme.name
                  ? 'border-primary-500 ring-2 ring-primary-500/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
              }`}
              style={{ background: theme.bg }}
            >
              <div
                className="absolute inset-1.5 rounded"
                style={{ background: theme.fg }}
              />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {theme.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom colors (collapsible) */}
      {showCustomColors && (
        <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foreground</label>
            <input type="color" value={fgColor} onChange={(e) => { setFgColor(e.target.value); setActiveTheme('custom') }} className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background</label>
            <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setActiveTheme('custom') }} className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
          </div>
        </div>
      )}

      {/* Design options row */}
      <div className="flex flex-wrap gap-4">
        <Select
          label="Dot Style"
          value={dotStyle}
          onChange={(e) => setDotStyle(e.target.value as DotStyle)}
          options={dotStyleOptions}
          className="w-36"
        />
        <Select
          label="Error Correction"
          value={ecLevel}
          onChange={(e) => setEcLevel(e.target.value as ECLevel)}
          options={ecOptions}
          className="w-40"
        />
        <Select
          label="Size"
          value={String(size)}
          onChange={(e) => setSize(Number(e.target.value))}
          options={[
            { value: '150', label: '150px' },
            { value: '200', label: '200px' },
            { value: '300', label: '300px' },
            { value: '400', label: '400px' },
            { value: '500', label: '500px' },
            { value: '800', label: '800px' },
            { value: '1000', label: '1000px' },
          ]}
          className="w-32"
        />
        <Select
          label="Format"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'png' | 'svg')}
          options={[
            { value: 'png', label: 'PNG' },
            { value: 'svg', label: 'SVG' },
          ]}
          className="w-28"
        />
      </div>

      {/* Margin slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Margin: {margin}
        </label>
        <input
          type="range"
          min={0}
          max={8}
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
      </div>

      {/* Logo upload */}
      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Center Logo (optional)
          </label>
          <div className="flex items-center gap-2">
            {logo && (
              <button
                onClick={() => { setLogo(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Remove
              </button>
            )}
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              icon={<Upload className="w-3.5 h-3.5" />}
            >
              Upload
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
        {logo && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Logo Size: {logoSize}%
            </label>
            <input
              type="range"
              min={10}
              max={35}
              value={logoSize}
              onChange={(e) => setLogoSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>
        )}
      </div>

      {/* Preview & Download */}
      {text && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white shadow-sm">
            <canvas ref={canvasRef} />
          </div>
          <Button onClick={download} icon={<Download className="w-4 h-4" />}>
            Download {format.toUpperCase()}
          </Button>
        </div>
      )}
    </div>
  )
}
