import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Download } from 'lucide-react'

const SIZES = [16, 32, 48, 64]

export default function FaviconGenerator() {
  const [text, setText] = useState('T')
  const [bgColor, setBgColor] = useState('#6366f1')
  const [textColor, setTextColor] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(48)
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => setUploadedImage(img)
    img.src = URL.createObjectURL(file)
  }

  const generateAndDownload = (size: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (uploadedImage) {
      ctx.drawImage(uploadedImage, 0, 0, size, size)
    } else {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = textColor
      const scaledFontSize = (fontSize / 64) * size
      ctx.font = `bold ${scaledFontSize}px Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2)
    }

    const link = document.createElement('a')
    link.download = `favicon-${size}x${size}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const downloadAll = () => SIZES.forEach((size) => generateAndDownload(size))

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => inputRef.current?.click()}>
          Upload Image
        </Button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        {uploadedImage && (
          <Button variant="ghost" onClick={() => setUploadedImage(null)}>Remove Image</Button>
        )}
      </div>

      {!uploadedImage && (
        <div className="flex flex-wrap gap-4">
          <Input
            label="Letter/Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2}
            className="w-24"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text Color</label>
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
          </div>
          <Input
            label="Font Size"
            type="number"
            min={10}
            max={100}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-24"
          />
        </div>
      )}

      {/* Previews */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</p>
        <div className="flex items-end gap-4 flex-wrap">
          {SIZES.map((size) => (
            <div key={size} className="text-center">
              <div className="border border-gray-200 dark:border-gray-700 rounded p-2 inline-block bg-white">
                <FaviconPreview
                  size={size}
                  text={text}
                  bgColor={bgColor}
                  textColor={textColor}
                  fontSize={fontSize}
                  image={uploadedImage}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{size}x{size}</p>
              <Button variant="ghost" size="sm" onClick={() => generateAndDownload(size)} className="mt-1">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={downloadAll} icon={<Download className="w-4 h-4" />}>
        Download All Sizes
      </Button>
    </div>
  )
}

function FaviconPreview({ size, text, bgColor, textColor, fontSize, image }: {
  size: number; text: string; bgColor: string; textColor: string; fontSize: number; image: HTMLImageElement | null
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (image) {
      ctx.drawImage(image, 0, 0, size, size)
    } else {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = textColor
      const scaledFontSize = (fontSize / 64) * size
      ctx.font = `bold ${scaledFontSize}px Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2)
    }
  }, [size, text, bgColor, textColor, fontSize, image])

  return <canvas ref={ref} style={{ width: size, height: size, imageRendering: 'pixelated' }} />
}
