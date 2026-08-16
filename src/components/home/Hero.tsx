import { SearchBar } from '@/components/search/SearchBar'

export function Hero() {
  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          100+ Free Tools for{' '}
          <span className="text-primary-600 dark:text-primary-400">Everyday Work</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Convert, calculate, create, compress, code and generate — all from one simple platform.
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar large />
        </div>
        <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
          Try &quot;compress image&quot;, &quot;JSON formatter&quot;, or &quot;QR generator&quot;
        </p>
      </div>
    </section>
  )
}
