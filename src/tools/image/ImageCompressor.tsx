import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { Select } from '@/components/ui/Select'
import { DropZone } from '@/components/ui/DropZone'
import { Download } from 'lucide-react'
import { formatFileSize } from '@/utils/format'

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(70)
  const [format, setFormat] = useState('image/jpeg')
  const [compressed, setCompressed] = useState<{ blob: Blob; url: string } | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = (files: File[]) => {
    if (files[0]?.type.startsWith('image/')) {
      setFile(files[0])
      setCompressed(null)
      setError('')
    } else {
      setError('Please upload an image file (JPG, PNG, WEBP).')
    }
  }

  const compress = async () => {
    if (!file) return
    setProcessing(true)
    setError('')
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: quality / 100,
        fileType: format,
      }
      const blob = await imageCompression(file, options)
      const url = URL.createObjectURL(blob)
      setCompressed({ blob, url })
    } catch {
      setError('Compression failed. Please try a different image.')
    }
    setProcessing(false)
  }

  const download = () => {
    if (!compressed || !file) return
    const ext = format.split('/')[1]
    const name = file.name.replace(/\.[^.]+$/, '') + `_compressed.${ext}`
    const a = document.createElement('a')
    a.href = compressed.url
    a.download = name
    a.click()
  }

  const savings = file && compressed
    ? Math.max(0, ((file.size - compressed.blob.size) / file.size) * 100)
    : 0

  return (
    <div className="space-y-6">
      {!file && <DropZone onFiles={handleFiles} accept="image/*" label="Drop your image here" />}

      {file && (
        <>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
              <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setCompressed(null) }}>Change</Button>
          </div>

          <Slider label="Quality" value={quality} min={1} max={100} onChange={setQuality} displayValue={`${quality}%`} />

          <Select
            label="Output Format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { value: 'image/jpeg', label: 'JPEG' },
              { value: 'image/png', label: 'PNG' },
              { value: 'image/webp', label: 'WEBP' },
            ]}
            className="w-40"
          />

          <Button onClick={compress} disabled={processing}>
            {processing ? 'Compressing...' : 'Compress Image'}
          </Button>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {compressed && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-xs text-gray-500">Original</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatFileSize(file.size)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-xs text-gray-500">Compressed</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatFileSize(compressed.blob.size)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-xs text-gray-500">Saved</p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{savings.toFixed(0)}%</p>
                </div>
              </div>
              <div className="flex justify-center">
                <img src={compressed.url} alt="Compressed" className="max-h-48 rounded-lg" />
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
