import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { Button } from '@/components/ui/Button'
import { DropZone } from '@/components/ui/DropZone'
import { Download } from 'lucide-react'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{ url: string; page: number; dataUrl: string }[]>([])
  const [quality, setQuality] = useState(90)
  const [scale, setScale] = useState(2)

  const handleFiles = async (files: File[]) => {
    const f = files[0]
    if (f?.type !== 'application/pdf') return
    setFile(f)
    setResults([])
    try {
      const bytes = await f.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise
      setPageCount(doc.numPages)
    } catch {
      setPageCount(0)
    }
  }

  const convert = async () => {
    if (!file) return
    setProcessing(true)
    setResults([])
    setProgress(0)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise
      const totalPages = doc.numPages
      const results: { url: string; page: number; dataUrl: string }[] = []

      for (let i = 1; i <= totalPages; i++) {
        const page = await doc.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!

        await page.render({ canvasContext: ctx, viewport }).promise

        const dataUrl = canvas.toDataURL('image/jpeg', quality / 100)
        results.push({ url: dataUrl, page: i, dataUrl })
        setProgress(Math.round((i / totalPages) * 100))
      }

      setResults(results)
    } catch {
      alert('Failed to process PDF.')
    }
    setProcessing(false)
  }

  const downloadPage = (dataUrl: string, page: number) => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `page-${page}.jpg`
    a.click()
  }

  const downloadAll = () => {
    results.forEach((r) => downloadPage(r.dataUrl, r.page))
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
              <p className="text-xs text-gray-500">{pageCount} pages</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResults([]) }}>Change</Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quality: {quality}%</label>
              <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-32 accent-primary-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scale: {scale}x</label>
              <input type="range" min={1} max={4} step={0.5} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-32 accent-primary-600" />
            </div>
          </div>

          <Button onClick={convert} disabled={processing}>
            {processing ? `Converting... ${progress}%` : 'Convert to JPG'}
          </Button>

          {processing && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {results.length} pages converted to JPG.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {results.map((r) => (
                  <div key={r.page} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
                    <img src={r.dataUrl} alt={`Page ${r.page}`} className="w-full rounded mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Page {r.page}</p>
                    <Button variant="ghost" size="sm" onClick={() => downloadPage(r.dataUrl, r.page)} className="mt-2" icon={<Download className="w-3 h-3" />}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
              <Button onClick={downloadAll} icon={<Download className="w-4 h-4" />}>Download All Images</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
