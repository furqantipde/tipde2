import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/Button'
import { DropZone } from '@/components/ui/DropZone'
import { X, GripVertical } from 'lucide-react'
import { formatFileSize } from '@/utils/format'

export default function MergePdf() {
  const [files, setFiles] = useState<{ file: File; id: string }[]>([])
  const [processing, setProcessing] = useState(false)

  const handleFiles = (newFiles: File[]) => {
    const pdfs = newFiles.filter((f) => f.type === 'application/pdf')
    setFiles((prev) => [...prev, ...pdfs.map((f) => ({ file: f, id: crypto.randomUUID() }))])
  }

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))

  const moveUp = (i: number) => {
    if (i === 0) return
    setFiles((prev) => { const c = [...prev]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; return c })
  }

  const moveDown = (i: number) => {
    setFiles((prev) => { if (i >= prev.length - 1) return prev; const c = [...prev]; [c[i], c[i + 1]] = [c[i + 1], c[i]]; return c })
  }

  const merge = async () => {
    if (files.length < 2) return
    setProcessing(true)
    try {
      const merged = await PDFDocument.create()
      for (const { file } of files) {
        const bytes = await file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach((p) => merged.addPage(p))
      }
      const pdfBytes = await merged.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to merge PDFs. Make sure all files are valid PDFs.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-6">
      <DropZone onFiles={handleFiles} accept="application/pdf" multiple label="Drop PDF files here" description="Select two or more PDFs to merge" />

      {files.length > 0 && (
        <>
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="text-xs text-gray-400 w-6 text-center">{i + 1}</span>
                <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-[10px] font-bold">PDF</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{f.file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(f.file.size)}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"><GripVertical className="w-4 h-4 rotate-180" /></button>
                  <button onClick={() => moveDown(i)} disabled={i === files.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"><GripVertical className="w-4 h-4" /></button>
                  <button onClick={() => removeFile(f.id)} className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={merge} disabled={files.length < 2 || processing}>
            {processing ? 'Merging...' : `Merge ${files.length} PDFs`}
          </Button>
        </>
      )}
    </div>
  )
}
