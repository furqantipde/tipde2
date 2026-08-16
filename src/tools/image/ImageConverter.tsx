import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { DropZone } from '@/components/ui/DropZone'
import { Download } from 'lucide-react'

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState('image/png')
  const [resultUrl, setResultUrl] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleFiles = (files: File[]) => {
    const f = files[0]
    if (!f?.type.startsWith('image/')) return
    setFile(f)
    setResultUrl('')
    const img = new Image()
    img.onload = () => { imgRef.current = img }
    img.src = URL.createObjectURL(f)
  }

  const convert = () => {
    if (!imgRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = imgRef.current.naturalWidth
    canvas.height = imgRef.current.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // For JPEG, fill white background (no transparency)
    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.drawImage(imgRef.current, 0, 0)
    setResultUrl(canvas.toDataURL(outputFormat, 0.92))
  }

  const download = () => {
    if (!resultUrl || !file) return
    const ext = outputFormat.split('/')[1]
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = file.name.replace(/\.[^.]+$/, '') + `.${ext}`
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
              <p className="text-xs text-gray-500">{file.type.split('/')[1]?.toUpperCase()}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResultUrl('') }} className="ml-auto">Change</Button>
          </div>

          <Select
            label="Output Format"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            options={[
              { value: 'image/png', label: 'PNG' },
              { value: 'image/jpeg', label: 'JPEG' },
              { value: 'image/webp', label: 'WEBP' },
            ]}
            className="w-40"
          />

          <Button onClick={convert}>Convert</Button>

          {resultUrl && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="Converted" className="max-h-64 rounded-lg border border-gray-200 dark:border-gray-700" />
              </div>
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
