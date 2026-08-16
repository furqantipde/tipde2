import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/Button'
import { DropZone } from '@/components/ui/DropZone'
import { Download } from 'lucide-react'
import { formatFileSize } from '@/utils/format'

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null)

  const handleFiles = (files: File[]) => {
    const f = files[0]
    if (f?.type !== 'application/pdf') return
    setFile(f)
    setResult(null)
  }

  const compress = async () => {
    if (!file) return
    setProcessing(true)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true })
      // pdf-lib compression: save with object streams
      const pdfBytes = await doc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      })
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setResult({ blob, url })
    } catch {
      alert('Failed to compress PDF.')
    }
    setProcessing(false)
  }

  const download = () => {
    if (!result || !file) return
    const a = document.createElement('a')
    a.href = result.url
    a.download = file.name.replace('.pdf', '_compressed.pdf')
    a.click()
  }

  const savings = file && result ? Math.max(0, ((file.size - result.blob.size) / file.size) * 100) : 0

  return (
    <div className="space-y-6">
      {!file && <DropZone onFiles={handleFiles} accept="application/pdf" label="Drop your PDF here" />}

      {file && (
        <>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-xs font-bold">PDF</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResult(null) }}>Change</Button>
          </div>

          <Button onClick={compress} disabled={processing}>
            {processing ? 'Compressing...' : 'Compress PDF'}
          </Button>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-xs text-gray-500">Original</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatFileSize(file.size)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-xs text-gray-500">Compressed</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatFileSize(result.blob.size)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-xs text-gray-500">Saved</p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{savings.toFixed(0)}%</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={download} icon={<Download className="w-4 h-4" />}>Download Compressed PDF</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
