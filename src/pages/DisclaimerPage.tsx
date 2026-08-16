import { Link } from 'react-router-dom'

const LAST_UPDATED = 'August 16, 2026'

export function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Disclaimer</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          The information provided by TipdeHub ("we," "our," or "us") on <strong>tipdehub.com</strong> (the
          "Site") is for general informational and utility purposes only. All information and tools on
          the Site are provided in good faith; however, we make no representation or warranty of any
          kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability,
          or completeness of any information or tools on the Site.
        </p>

        <Section title="1. No Responsibility Disclaimer">
          <p>
            The tools provided on TipdeHub are designed for general use and are offered "as is" without
            any warranties. While we strive to ensure accuracy and reliability, we cannot guarantee that
            the results produced by our tools will be error-free or suitable for every purpose.
          </p>
          <p className="mt-2">
            Under no circumstance shall we have any liability to you for any loss or damage of any kind
            incurred as a result of the use of the Site or reliance on any information or tool provided
            on the Site. Your use of the Site and any reliance on its tools or information is solely at
            your own risk.
          </p>
        </Section>

        <Section title="2. Tool Accuracy">
          <p>
            Our calculators, converters, generators, and other tools are provided for convenience and
            general guidance. Results should be verified independently when used for critical decisions
            such as financial planning, medical assessments, legal matters, or engineering calculations.
          </p>
          <p className="mt-2">
            We do not guarantee the mathematical or computational accuracy of any tool on the Site.
            Always double-check important calculations with authoritative sources.
          </p>
        </Section>

        <Section title="3. External Links Disclaimer">
          <p>
            The Site may contain links to other websites or content belonging to or originating from
            third parties. Such external links are not investigated, monitored, or checked for accuracy,
            adequacy, validity, reliability, availability, or completeness by us.
          </p>
          <p className="mt-2">
            We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or
            reliability of any information offered by third-party websites linked through the Site.
            We will not be a party to or in any way be responsible for monitoring any transaction between
            you and third-party providers of products or services.
          </p>
        </Section>

        <Section title="4. Professional Disclaimer">
          <p>
            The Site cannot and does not contain professional financial, medical, legal, or other advice.
            The information and tools are provided for general informational and educational purposes
            only and are not a substitute for professional advice.
          </p>
          <p className="mt-2">
            Accordingly, we encourage you to consult the appropriate professional before taking any
            action based on information or results from our tools.
          </p>
        </Section>

        <Section title="5. Fair Use Disclaimer">
          <p>
            The Site may contain copyrighted material the use of which has not always been specifically
            authorized by the copyright owner. We believe this constitutes "fair use" of any such
            copyrighted material as provided for in applicable copyright law. If you wish to use
            copyrighted material from the Site for purposes of your own that go beyond fair use, you
            must obtain permission from the copyright owner.
          </p>
        </Section>

        <Section title="6. Views Expressed Disclaimer">
          <p>
            The views and opinions expressed on the Site are solely those of TipdeHub and do not
            necessarily reflect the official policy or position of any other person, institution,
            organization, or company.
          </p>
        </Section>

        <Section title="7. Errors and Omissions Disclaimer">
          <p>
            While we have made every attempt to ensure that the information and tools on the Site are
            accurate and functional, we are not responsible for any errors, omissions, or for the
            results obtained from the use of this information or these tools. All information and tools
            on the Site are provided "as is," with no guarantee of completeness, accuracy, timeliness,
            or of the results obtained from their use.
          </p>
        </Section>

        <Section title="8. Data Processing Disclaimer">
          <p>
            Most tools on TipdeHub process data locally within your web browser. Your files and data
            are not uploaded to our servers. However, you are responsible for ensuring that any data
            you process using our tools complies with applicable laws and regulations, including data
            protection and privacy laws.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            If you have any questions about this Disclaimer, please visit our{' '}
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
