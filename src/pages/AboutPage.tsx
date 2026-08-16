import { Link } from 'react-router-dom'
import { Shield, Zap, Globe, Users } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">About TipdeHub</h1>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          TipdeHub is an all-in-one web utility platform that brings together 26+ free tools in
          one place. From image compression to JSON formatting, QR code generation to PDF conversion
          — everything you need for everyday digital tasks, right in your browser.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We believe that useful tools should be free, fast, and accessible to everyone. No sign-ups
          required for most tools. No unnecessary data collection. Just open the tool and get your
          work done.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Our goal is to build the most comprehensive collection of browser-based utility tools that
          help developers, designers, students, marketers, and everyday users accomplish their tasks
          quickly and efficiently — all without installing any software.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Why TipdeHub?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 not-prose">
          <Feature icon={<Shield className="w-5 h-5" />} title="100% Private" desc="All processing happens in your browser. Your files and data never leave your device." />
          <Feature icon={<Zap className="w-5 h-5" />} title="Lightning Fast" desc="No uploads, no server processing. Tools run instantly using modern browser APIs." />
          <Feature icon={<Globe className="w-5 h-5" />} title="Works Everywhere" desc="No software to install. Works on any device with a modern web browser." />
          <Feature icon={<Users className="w-5 h-5" />} title="Free Forever" desc="All tools are completely free to use with no hidden charges or premium tiers." />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">What We Offer</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Our platform currently includes tools across six categories:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400 mb-4">
          <li><strong>Text Tools</strong> — Word counter, case converter, slug generator, duplicate line remover</li>
          <li><strong>Developer Tools</strong> — JSON formatter, Base64 encoder, URL encoder, UUID generator, password generator</li>
          <li><strong>Calculators</strong> — Percentage, age, BMI, discount, and profit/loss calculators</li>
          <li><strong>Generators</strong> — QR code, favicon, and color palette generators</li>
          <li><strong>Image Tools</strong> — Image compressor, resizer, converter, and cropper</li>
          <li><strong>PDF Tools</strong> — JPG to PDF, PDF to JPG, merge, split, and compress PDFs</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We are constantly adding new tools based on what our users need. If there is a tool you
          would like to see on TipdeHub, <Link to="/contact" className="text-primary-600 hover:underline">let us know</Link>!
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Privacy First</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Unlike many online tool platforms, most TipdeHub tools work entirely in your browser. Your
          files never leave your device. When server processing is required, files are handled securely
          and deleted automatically. We do not require accounts, do not track your file contents, and
          do not sell your data. Read our full <Link to="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</Link> for details.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Our Commitment</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We are committed to providing high-quality, reliable tools that you can trust. Every tool
          on our platform is tested, maintained, and regularly updated to ensure the best possible
          experience. If you encounter any issues or have suggestions, please visit our{' '}
          <Link to="/contact" className="text-primary-600 hover:underline">Contact page</Link>.
        </p>
      </div>

      <div className="mt-8">
        <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary-600 dark:text-primary-400">{icon}</span>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  )
}
