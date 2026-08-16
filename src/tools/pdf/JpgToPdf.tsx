import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { DropZone } from '@/components/ui/DropZone'
import { Download, GripVertical, X } from 'lucide-react'

export default function JpgToPdf() {
  const [images, setImages] = useState<{ file: File; url: string; id: string }[]>([])
  const [pageSize, setPageSize] = useState('a4')
  const [processing, setProcessing] = useState(false)

  const handleFiles = (files: File[]) => {
    const newImages = files
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ file: f, url: URL.createObjectURL(f), id: crypto.randomUUID() }))
    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setImages((prev) => {
      const copy = [...prev]
      ;[copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]
      return copy
    })
  }

  const moveDown = (index: number) => {
    setImages((prev) => {
      if (index >= prev.length - 1) return prev
      const copy = [...prev]
      ;[copy[index], copy[index + 1]] = [copy[index + 1], copy[index]]
      return copy
    })
  }

  const generate = async () => {
    if (images.length === 0) return
    setProcessing(true)
    try {
      const pdfDoc = await PDFDocument.create()
      const pageSizes: Record<string, [number, number]> = {
        a4: [595.28, 841.89],
        letter: [612, 792],
        legal: [612, 1008],
      }
      const [pw, ph] = pageSizes[pageSize] || pageSizes.a4

      for (const img of images) {
        const bytes = await img.file.arrayBuffer()
        let pdfImage
        if (img.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(bytes)
        } else {
          pdfImage = await pdfDoc.embedJpg(bytes)
        }
        const page = pdfDoc.addPage([pw, ph])
        const scale = Math.min(pw / pdfImage.width, ph / pdfImage.height) * 0.9
        const w = pdfImage.width * scale
        const h = pdfImage.height * scale
        page.drawImage(pdfImage, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'images.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to generate PDF. Make sure all files are valid images.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-6">
      <DropZone onFiles={handleFiles} accept="image/*" multiple label="Drop images here" description="JPG, PNG, or WEBP images" />

      {images.length > 0 && (
        <>
          <div className="space-y-2">
            {images.map((img, i) => (
              <div key={img.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="text-xs text-gray-400 w-6 text-center">{i + 1}</span>
                <img src={img.url} alt="" className="w-10 h-10 rounded object-cover" />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{img.file.name}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"><GripVertical className="w-4 h-4 rotate-180" /></button>
                  <button onClick={() => moveDown(i)} disabled={i === images.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"><GripVertical className="w-4 h-4" /></button>
                  <button onClick={() => removeImage(img.id)} className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <Select
            label="Page Size"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            options={[
              { value: 'a4', label: 'A4' },
              { value: 'letter', label: 'Letter' },
              { value: 'legal', label: 'Legal' },
            ]}
            className="w-40"
          />

          <Button onClick={generate} disabled={processing}>
            {processing ? 'Generating...' : `Generate PDF (${images.length} images)`}
          </Button>
        </>
      )}
    </div>
  )
}
