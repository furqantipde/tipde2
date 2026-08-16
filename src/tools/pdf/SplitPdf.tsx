import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DropZone } from '@/components/ui/DropZone'
import { formatFileSize } from '@/utils/format'

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [ranges, setRanges] = useState('')
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<{ url: string; label: string }[]>([])

  const handleFiles = async (files: File[]) => {
    const f = files[0]
    if (f?.type !== 'application/pdf') return
    setFile(f)
    setResults([])
    try {
      const bytes = await f.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setPageCount(doc.getPageCount())
    } catch {
      setPageCount(0)
    }
  }

  const split = async () => {
    if (!file || !ranges) return
    setProcessing(true)
    setResults([])
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      const rangeGroups = ranges.split(',').map((r) => r.trim())
      const results: { url: string; label: string }[] = []

      for (const group of rangeGroups) {
        const [startStr, endStr] = group.split('-').map((s) => s.trim())
        const start = Math.max(1, parseInt(startStr) || 1) - 1
        const end = Math.min(pageCount, parseInt(endStr) || start + 1) - 1
        const indices = Array.from({ length: end - start + 1 }, (_, i) => start + i)

        const newDoc = await PDFDocument.create()
        const pages = await newDoc.copyPages(doc, indices)
        pages.forEach((p) => newDoc.addPage(p))
        const pdfBytes = await newDoc.save()
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
        results.push({ url: URL.createObjectURL(blob), label: `Pages ${start + 1}-${end + 1}` })
      }

      setResults(results)
    } catch {
      alert('Failed to split PDF.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-6">
      {!file && <DropZone onFiles={handleFiles} accept="application/pdf" label="Drop your PDF here" />}

      {file && (
        <>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-xs font-bold">PDF</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{pageCount} pages - {formatFileSize(file.size)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResults([]) }}>Change</Button>
          </div>

          <Input
            label="Page Ranges"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="e.g., 1-3, 4, 5-8"
          />
          <p className="text-xs text-gray-400">Enter page ranges separated by commas. Example: 1-3, 5, 7-10</p>

          <Button onClick={split} disabled={processing}>
            {processing ? 'Splitting...' : 'Split PDF'}
          </Button>

          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">{results.length} files created:</p>
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-900 dark:text-gray-100">{r.label}</span>
                  <Button variant="outline" size="sm" onClick={() => { const a = document.createElement('a'); a.href = r.url; a.download = `split-${i + 1}.pdf`; a.click() }}>
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
