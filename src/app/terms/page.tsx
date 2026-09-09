import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-block mb-8 text-blue-600 hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              By accessing or using Drinkly (&quot;the Platform&quot;), you agree to be bound
              by these Terms of Service. If you do not agree to these terms, you
              may not use the Platform. Drinkly reserves the right to modify
              these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Age Requirements</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              You must be at least 18 years of age (or the legal drinking age
              in your jurisdiction, whichever is higher) to use Drinkly. By
              using the Platform, you represent and warrant that you meet this
              age requirement. We reserve the right to request proof of age at
              any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Account Registration</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              You must provide accurate and complete information when creating
              an account. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities
              that occur under your account. You must notify us immediately of
              any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Alcohol Orders</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              All alcoholic beverages available on Drinkly are sold by licensed
              retailers. Drinkly acts as a platform connecting consumers with
              these retailers. We do not sell alcohol directly. All orders are
              subject to applicable laws and regulations regarding the sale and
              delivery of alcoholic beverages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Delivery and Age Verification</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Age verification is mandatory for all alcohol deliveries. The
              delivery agent will verify your government-issued photo ID upon
              delivery. If you are unable to provide valid identification or
              appear to be intoxicated, the delivery may be refused. No refund
              will be provided for refused deliveries due to failed age
              verification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Payments</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              All payments are processed through secure, PCI-compliant payment
              gateways. Prices include all applicable taxes unless otherwise
              stated. Drinkly reserves the right to change prices at any time
              without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cancellations and Refunds</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Orders may be cancelled within 15 minutes of placement. After
              this period, cancellations may not be possible. Refunds for
              cancelled orders will be processed within 5-7 business days.
              Due to the nature of the product, returns of alcohol are generally
              not accepted unless the product is defective or incorrect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Prohibited Conduct</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              You agree not to: (a) use the Platform for any unlawful purpose;
              (b) provide false or misleading information; (c) attempt to
              circumvent age verification requirements; (d) purchase alcohol
              for minors; (e) use automated systems to access the Platform; or
              (f) interfere with the proper functioning of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Drinkly shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of the
              Platform. Our total liability shall not exceed the amount paid by
              you for the specific order giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of India. Any disputes arising under these Terms shall be
              subject to the exclusive jurisdiction of the courts in Mumbai,
              India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@drinkly.com" className="text-blue-600 hover:underline">
                legal@drinkly.com
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
