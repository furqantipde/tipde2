import { Link } from 'react-router-dom'

const LAST_UPDATED = 'August 16, 2026'

export function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          At TipdeHub ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your information when you visit
          our website <strong>tipdehub.com</strong> (the "Site") and use our free online tools.
        </p>

        <Section title="1. Information We Collect">
          <SubSection title="Information You Provide">
            <p>
              Most of our tools operate entirely in your browser and do not send any data to our servers.
              When you use tools such as image compressors, PDF converters, or text formatters, all
              processing happens locally on your device. We do not upload, store, or transmit your files
              or input data.
            </p>
          </SubSection>
          <SubSection title="Automatically Collected Information">
            <p>
              We may automatically collect certain information when you visit our Site, including:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address (anonymized)</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring website addresses</li>
            </ul>
          </SubSection>
        </Section>

        <Section title="2. Cookies and Tracking Technologies">
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our Site.
            Cookies are small text files stored on your device by your browser.
          </p>
          <SubSection title="Types of Cookies We Use">
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Essential Cookies:</strong> Required for the Site to function properly (e.g., theme preferences, localStorage settings).</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Site so we can improve it.</li>
              <li><strong>Advertising Cookies:</strong> Used by our advertising partners (such as Google AdSense) to deliver relevant ads and track ad performance.</li>
            </ul>
          </SubSection>
          <p className="mt-3">
            You can control cookies through your browser settings. However, disabling certain cookies
            may affect the functionality of the Site.
          </p>
        </Section>

        <Section title="3. Google AdSense and Third-Party Advertising">
          <p>
            We use Google AdSense to display advertisements on our Site. Google AdSense uses cookies
            and web beacons to serve ads based on your prior visits to our Site and other websites on
            the Internet.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our Site and/or other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Ads Settings</a>.</li>
            <li>You may opt out of third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">www.aboutads.info</a>.</li>
          </ul>
          <p className="mt-3">
            Third-party vendors, including Google, use cookies to serve ads based on a user's prior
            visits to your website or other websites. For more information, please review
            Google's <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Privacy Policy</a>.
          </p>
        </Section>

        <Section title="4. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Operate and maintain the Site and its tools</li>
            <li>Improve user experience and Site functionality</li>
            <li>Analyze usage patterns and traffic trends</li>
            <li>Display relevant advertisements</li>
            <li>Respond to inquiries and provide customer support</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="5. Data Sharing">
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            anonymized, aggregated data with:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Advertising partners (Google AdSense) for ad delivery and optimization</li>
            <li>Analytics providers to help us understand Site usage</li>
            <li>Service providers who assist in operating our Site</li>
          </ul>
        </Section>

        <Section title="6. Data Security">
          <p>
            We implement appropriate technical and organizational measures to protect your information.
            However, no method of transmission over the Internet or electronic storage is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="7. Your Rights (GDPR & CCPA)">
          <p>Depending on your location, you may have the following rights:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data.</li>
            <li><strong>Right to Restrict Processing:</strong> Request that we limit how we use your data.</li>
            <li><strong>Right to Data Portability:</strong> Request transfer of your data to another party.</li>
            <li><strong>Right to Object:</strong> Object to processing of your personal data.</li>
            <li><strong>Do Not Sell My Personal Information (CCPA):</strong> We do not sell personal information.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, please contact us at the email address provided in our{' '}
            <Link to="/contact" className="text-primary-600 hover:underline">Contact page</Link>.
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            Our Site is not directed to children under the age of 13. We do not knowingly collect
            personal information from children under 13. If you believe we have collected information
            from a child under 13, please contact us immediately and we will take steps to remove
            such information.
          </p>
        </Section>

        <Section title="9. External Links">
          <p>
            Our Site may contain links to external websites. We are not responsible for the privacy
            practices or content of those sites. We encourage you to read the privacy policies of
            any third-party websites you visit through links on our Site.
          </p>
        </Section>

        <Section title="10. Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
            You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            If you have any questions about this Privacy Policy, please visit our{' '}
            <Link to="/contact" className="text-primary-600 hover:underline">Contact page</Link>{' '}
            or email us at <strong>fchattha206@gmail.com</strong>.
          </p>
        </Section>
      </div>

      <div className="mt-8 flex gap-4">
        <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline">&larr; Back to Home</Link>
        <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service &rarr;</Link>
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">{title}</h3>
      {children}
    </div>
  )
}
