import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Download } from 'lucide-react'

export default function QrGenerator() {
  const [text, setText] = useState('https://tipde.online')
  const [size, setSize] = useState(300)
  const [format, setFormat] = useState<'png' | 'svg'>('png')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [svgData, setSvgData] = useState('')

  useEffect(() => {
    if (!text || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    }).catch(() => {})
    QRCode.toString(text, { type: 'svg', width: size, margin: 2, color: { dark: fgColor, light: bgColor } })
      .then(setSvgData)
      .catch(() => {})
  }, [text, size, fgColor, bgColor])

  const download = () => {
    if (format === 'png' && canvasRef.current) {
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    } else if (format === 'svg' && svgData) {
      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = 'qrcode.svg'
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      <Input
        label="Text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text, URL, email, or phone number"
      />

      <div className="flex flex-wrap gap-4">
        <Select
          label="Size"
          value={String(size)}
          onChange={(e) => setSize(Number(e.target.value))}
          options={[
            { value: '100', label: '100px' },
            { value: '200', label: '200px' },
            { value: '300', label: '300px' },
            { value: '500', label: '500px' },
            { value: '800', label: '800px' },
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
          className="w-32"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foreground</label>
          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
        </div>
      </div>

      {text && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white">
            <canvas ref={canvasRef} className={format === 'svg' ? 'hidden' : ''} />
            {format === 'svg' && svgData && (
              <div dangerouslySetInnerHTML={{ __html: svgData }} />
            )}
          </div>
          <Button onClick={download} icon={<Download className="w-4 h-4" />}>
            Download {format.toUpperCase()}
          </Button>
        </div>
      )}
    </div>
  )
}
