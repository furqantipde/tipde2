import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { DropZone } from '@/components/ui/DropZone'
import { Download, Crop } from 'lucide-react'

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resultUrl, setResultUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFiles = (files: File[]) => {
    const f = files[0]
    if (!f?.type.startsWith('image/')) return
    setFile(f)
    setResultUrl('')
    const url = URL.createObjectURL(f)
    setImgSrc(url)
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight })
    }
    img.src = url
  }

  const getScale = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return 1
    const containerWidth = containerRef.current.clientWidth
    return containerWidth / imgRef.current.naturalWidth
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setDragging(true)
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setCrop({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: 0, h: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    setCrop((prev) => ({
      x: Math.min(prev.x, cx),
      y: Math.min(prev.y, cy),
      w: Math.abs(cx - dragStart.x),
      h: Math.abs(cy - dragStart.y),
    }))
  }

  const handleMouseUp = () => setDragging(false)

  const doCrop = () => {
    if (!imgRef.current || !crop.w || !crop.h) return
    const scale = 1 / getScale()
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(crop.w * scale)
    canvas.height = Math.round(crop.h * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(
      imgRef.current,
      crop.x * scale, crop.y * scale, crop.w * scale, crop.h * scale,
      0, 0, canvas.width, canvas.height
    )
    setResultUrl(canvas.toDataURL('image/png'))
  }

  const download = () => {
    if (!resultUrl || !file) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = file.name.replace(/\.[^.]+$/, '') + '_cropped.png'
    a.click()
  }

  // Draw crop overlay
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imgRef.current) return
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (crop.w > 0 && crop.h > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.clearRect(crop.x, crop.y, crop.w, crop.h)
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2
      ctx.strokeRect(crop.x, crop.y, crop.w, crop.h)
    }
  }, [crop])

  return (
    <div className="space-y-6">
      {!file && <DropZone onFiles={handleFiles} accept="image/*" label="Drop your image here" />}

      {file && imgSrc && (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click and drag to select the crop area.</p>

          <div
            ref={containerRef}
            className="relative inline-block cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img src={imgSrc} alt="Source" className="max-w-full h-auto rounded-lg" />
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none rounded-lg" style={{ width: '100%', height: '100%' }} />
          </div>

          <Button onClick={doCrop} icon={<Crop className="w-4 h-4" />}>Crop Image</Button>

          {resultUrl && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="Cropped" className="max-h-64 rounded-lg border border-gray-200 dark:border-gray-700" />
              </div>
              <div className="flex justify-center">
                <Button onClick={download} icon={<Download className="w-4 h-4" />}>Download</Button>
              </div>
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResultUrl('') }}>Change Image</Button>
        </>
      )}
    </div>
  )
}
