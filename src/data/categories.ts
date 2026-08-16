import type { Category } from '@/types/tool'

export const categories: Category[] = [
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Compress, resize, convert, and edit images directly in your browser.',
    icon: 'Image',
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    slug: 'image-tools',
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Convert, merge, split, and compress PDF files with ease.',
    icon: 'FileText',
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    slug: 'pdf-tools',
  },
  {
    id: 'calculators',
    name: 'Calculators',
    description: 'Financial, educational, and everyday calculators for quick math.',
    icon: 'Calculator',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    slug: 'calculators',
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    description: 'JSON formatters, encoders, generators, and more for developers.',
    icon: 'Code',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    slug: 'developer-tools',
  },
  {
    id: 'ai',
    name: 'AI Tools',
    description: 'AI-powered text summarizer, paraphraser, translator, and more.',
    icon: 'Bot',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    slug: 'ai-tools',
  },
  {
    id: 'files',
    name: 'File Tools',
    description: 'Compress, convert, and inspect files of all types.',
    icon: 'FolderOpen',
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    slug: 'file-tools',
  },
  {
    id: 'generators',
    name: 'Generators',
    description: 'QR codes, passwords, color palettes, favicons, and more.',
    icon: 'Sparkles',
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    slug: 'generators',
  },
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Word counters, case converters, text cleaners, and more.',
    icon: 'Type',
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    slug: 'text-tools',
  },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
