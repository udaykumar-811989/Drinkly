import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-block mb-8 text-blue-600 hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We collect information you provide directly, including:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>Account registration details (name, email, phone, date of birth)</li>
              <li>Delivery addresses</li>
              <li>Payment information (processed securely by third-party payment processors)</li>
              <li>Order history and preferences</li>
              <li>Communications with customer support</li>
              <li>Government-issued ID for age verification (when required)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Verify your age and identity as required by law</li>
              <li>Communicate about your orders and account</li>
              <li>Improve our services and user experience</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>Licensed retailers to fulfill your orders</li>
              <li>Delivery partners to complete deliveries</li>
              <li>Payment processors to handle transactions</li>
              <li>Law enforcement when required by law</li>
              <li>Service providers who assist in our operations</li>
            </ul>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We retain your personal information for as long as your account
              is active or as needed to provide you services. We may retain
              certain information as required by law or for legitimate business
              purposes. When you delete your account, we will remove your
              personal data within 30 days, except where retention is required
              by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your
              experience, analyze usage patterns, and personalize content. You
              can control cookie settings through your browser preferences.
              Essential cookies required for the Platform to function cannot be
              disabled.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Children&apos;s Privacy</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Drinkly is not intended for users under the age of 18. We do not
              knowingly collect personal information from children. If we become
              aware that we have collected personal information from a child, we
              will take steps to delete such information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the &quot;Last updated&quot; date. Your continued
              use of the Platform after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              For privacy-related inquiries, please contact our Data Protection
              Officer at{' '}
              <a href="mailto:privacy@drinkly.com" className="text-blue-600 hover:underline">
                privacy@drinkly.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500">
          <p>Last updated: January 2024</p>
        </div>
      </div>
    </div>
  )
}
