import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Copy, Check, RefreshCw } from 'lucide-react'

const WORD_LIST = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi', 'nesciunt',
]

function makeSentence(minWords: number, maxWords: number): string {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1))
  const words = Array.from({ length: count }, () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)])
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function makeParagraph(sentences: number): string {
  return Array.from({ length: sentences }, () => makeSentence(6, 14)).join(' ')
}

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = () => {
    let result = ''
    if (type === 'paragraphs') {
      result = Array.from({ length: count }, () => makeParagraph(4 + Math.floor(Math.random() * 4))).join('\n\n')
    } else if (type === 'sentences') {
      result = Array.from({ length: count }, () => makeSentence(6, 14)).join(' ')
    } else {
      const words = Array.from({ length: count }, () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)])
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
      result = words.join(' ') + '.'
    }
    setOutput(result)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <Select label="Type" value={type} onChange={(e) => setType(e.target.value as 'paragraphs' | 'sentences' | 'words')} options={[
          { value: 'paragraphs', label: 'Paragraphs' },
          { value: 'sentences', label: 'Sentences' },
          { value: 'words', label: 'Words' },
        ]} className="w-36" />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Count</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
        </div>
        <Button onClick={generate} icon={<RefreshCw className="w-4 h-4" />}>Generate</Button>
      </div>

      {output && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{output.split(/\s+/).filter(Boolean).length} words</span>
            <span>{output.length} characters</span>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{output}</p>
          </div>
          <Button onClick={copy} icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
        </div>
      )}
    </div>
  )
}
