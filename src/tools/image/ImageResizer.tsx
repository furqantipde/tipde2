import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DropZone } from '@/components/ui/DropZone'
import { Download, Lock as LockIcon, Unlock as UnlockIcon } from 'lucide-react'

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null)
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 })
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [lockAspect, setLockAspect] = useState(true)
  const [resultUrl, setResultUrl] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleFiles = (files: File[]) => {
    const f = files[0]
    if (!f?.type.startsWith('image/')) return
    setFile(f)
    setResultUrl('')
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight })
      setWidth(img.naturalWidth)
      setHeight(img.naturalHeight)
    }
    img.src = URL.createObjectURL(f)
  }

  const onWidthChange = (v: string) => {
    const w = parseInt(v) || 0
    setWidth(w)
    if (lockAspect && originalDims.w) {
      setHeight(Math.round((w / originalDims.w) * originalDims.h))
    }
  }

  const onHeightChange = (v: string) => {
    const h = parseInt(v) || 0
    setHeight(h)
    if (lockAspect && originalDims.h) {
      setWidth(Math.round((h / originalDims.h) * originalDims.w))
    }
  }

  const resize = () => {
    if (!imgRef.current || !width || !height) return
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(imgRef.current, 0, 0, width, height)
    setResultUrl(canvas.toDataURL('image/png'))
  }

  const download = () => {
    if (!resultUrl || !file) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = file.name.replace(/\.[^.]+$/, '') + `_${width}x${height}.png`
    a.click()
  }

  return (
    <div className="space-y-6">
      {!file && <DropZone onFiles={handleFiles} accept="image/*" label="Drop your image here" />}

      {file && (
        <>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
              <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
              <p className="text-xs text-gray-500">{originalDims.w} x {originalDims.h}px</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResultUrl('') }} className="ml-auto">Change</Button>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <Input label="Width (px)" type="number" min={1} value={width} onChange={(e) => onWidthChange(e.target.value)} className="w-28" />
            <button
              onClick={() => setLockAspect(!lockAspect)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer mb-0.5"
              title={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
            >
              {lockAspect ? <LockIcon className="w-4 h-4" /> : <UnlockIcon className="w-4 h-4" />}
            </button>
            <Input label="Height (px)" type="number" min={1} value={height} onChange={(e) => onHeightChange(e.target.value)} className="w-28" />
          </div>

          <Button onClick={resize}>Resize Image</Button>

          {resultUrl && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="Resized" className="max-h-64 rounded-lg border border-gray-200 dark:border-gray-700" />
              </div>
              <p className="text-center text-sm text-gray-500">Output: {width} x {height}px</p>
              <div className="flex justify-center">
                <Button onClick={download} icon={<Download className="w-4 h-4" />}>Download</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
