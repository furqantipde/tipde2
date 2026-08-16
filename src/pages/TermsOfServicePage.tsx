import { Link } from 'react-router-dom'

const LAST_UPDATED = 'August 16, 2026'

export function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to TipdeHub ("we," "our," or "us"). By accessing or using our website at{' '}
          <strong>tipdehub.com</strong> (the "Site") and our online tools, you agree to be bound by
          these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site.
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By using the Site, you confirm that you are at least 13 years of age and have the legal
            capacity to enter into these Terms. If you are using the Site on behalf of an organization,
            you represent that you have the authority to bind that organization to these Terms.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            TipdeHub provides free online utility tools including, but not limited to: image compression,
            PDF conversion, text formatting, code formatting, calculators, QR code generation, and other
            productivity tools (collectively, the "Services"). Most tools operate entirely within your
            web browser and do not require account creation.
          </p>
        </Section>

        <Section title="3. Use of the Site">
          <p>You agree to use the Site only for lawful purposes. You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Use the Site for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
            <li>Use automated systems (bots, scrapers, crawlers) to access the Site without prior written consent</li>
            <li>Interfere with or disrupt the operation of the Site</li>
            <li>Upload malicious files, viruses, or harmful code</li>
            <li>Reverse-engineer, decompile, or disassemble any part of the Site</li>
            <li>Use the Site in a way that could damage, disable, or impair its functionality</li>
          </ul>
        </Section>

        <Section title="4. Intellectual Property">
          <p>
            All content on the Site, including but not limited to text, graphics, logos, icons, images,
            and software, is the property of TipdeHub or its licensors and is protected by copyright,
            trademark, and other intellectual property laws.
          </p>
          <p className="mt-2">
            You may not reproduce, distribute, modify, display, or create derivative works from any
            content on the Site without our prior written permission. However, you may use the tools
            provided on the Site for their intended purpose without restriction.
          </p>
        </Section>

        <Section title="5. User Content">
          <p>
            Any files, text, or data you process using our tools remain entirely yours. We do not
            claim ownership over any content you process through our tools. Since most tools operate
            locally in your browser, your content is never transmitted to or stored on our servers.
          </p>
        </Section>

        <Section title="6. Disclaimer of Warranties">
          <p>
            THE SITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
            KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="mt-2">
            We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or
            other harmful components. We do not warrant that the results obtained from the use of the
            tools will be accurate or reliable.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, TIPDEHUB AND ITS AFFILIATES, OFFICERS,
            DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE,
            OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SITE OR SERVICES.
          </p>
          <p className="mt-2">
            Our total liability for any claims arising from these Terms or the Site shall not exceed
            one hundred U.S. dollars ($100).
          </p>
        </Section>

        <Section title="8. Third-Party Links and Services">
          <p>
            The Site may contain links to third-party websites or services that are not owned or
            controlled by TipdeHub. We have no control over, and assume no responsibility for, the
            content, privacy policies, or practices of any third-party websites or services.
          </p>
        </Section>

        <Section title="9. Advertising">
          <p>
            The Site may display advertisements provided by third-party advertising networks, including
            Google AdSense. By using the Site, you acknowledge and agree that third-party advertisements
            may appear on the Site. We are not responsible for the content, accuracy, or opinions expressed
            in such advertisements.
          </p>
        </Section>

        <Section title="10. Indemnification">
          <p>
            You agree to indemnify, defend, and hold harmless TipdeHub and its officers, directors,
            employees, and agents from and against any claims, liabilities, damages, losses, and expenses
            (including reasonable attorneys' fees) arising out of or in connection with your use of the
            Site, violation of these Terms, or violation of any rights of another party.
          </p>
        </Section>

        <Section title="11. Modifications to Terms">
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately
            upon posting the updated Terms on this page with a revised "Last updated" date. Your continued
            use of the Site after any changes constitutes your acceptance of the new Terms.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without
            regard to conflict of law principles. Any disputes arising from these Terms shall be resolved
            in the appropriate courts of the governing jurisdiction.
          </p>
        </Section>

        <Section title="13. Severability">
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision
            shall be limited or eliminated to the minimum extent necessary, and the remaining provisions
            shall remain in full force and effect.
          </p>
        </Section>

        <Section title="14. Contact">
          <p>
            For any questions about these Terms, please visit our{' '}
            <Link to="/contact" className="text-primary-600 hover:underline">Contact page</Link>{' '}
            or email us at <strong>fchattha206@gmail.com</strong>.
          </p>
        </Section>
      </div>

      <div className="mt-8 flex gap-4">
        <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline">&larr; Back to Home</Link>
        <Link to="/privacy-policy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy &rarr;</Link>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>
      <div className="text-gray-600 dark:text-gray-400 space-y-2">{children}</div>
    </section>
  )
}
