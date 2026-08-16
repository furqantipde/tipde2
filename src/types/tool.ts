import type { ComponentType } from 'react'

export type CategoryId =
  | 'image'
  | 'pdf'
  | 'calculators'
  | 'developer'
  | 'ai'
  | 'files'
  | 'generators'
  | 'text'

export interface Category {
  id: CategoryId
  name: string
  description: string
  icon: string
  color: string
  slug: string
}

export interface Tool {
  id: string
  slug: string
  name: string
  description: string
  category: CategoryId
  icon: string
  component: () => Promise<{ default: ComponentType }>
  keywords: string[]
  popular?: boolean
  howToUse?: string[]
  features?: string[]
  faq?: { question: string; answer: string }[]
}
