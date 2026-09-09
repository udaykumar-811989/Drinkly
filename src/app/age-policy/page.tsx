import Link from 'next/link'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function AgePolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-block mb-8 text-blue-600 hover:underline"
        >
          ← Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Age Verification Policy</h1>
        </div>

        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
            <div>
              <h2 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">
                Important Legal Notice
              </h2>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                It is illegal to purchase or consume alcoholic beverages if you
                are under the legal drinking age in your jurisdiction. False
                identification is a criminal offense punishable by law.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">Our Commitment</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Drinkly is committed to responsible alcohol service. We implement
              robust age verification measures to ensure that alcoholic
              beverages are only sold to individuals of legal drinking age. We
              comply with all applicable local, state, and national laws
              regarding the sale and delivery of alcohol.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Age Requirements</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Minimum Age for Registration</p>
                  <p className="text-sm text-neutral-500">
                    You must be at least 13 years old to create an account on
                    Drinkly. However, you cannot purchase alcohol until you
                    reach the legal drinking age.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Legal Drinking Age</p>
                  <p className="text-sm text-neutral-500">
                    The legal drinking age varies by jurisdiction. In India,
                    the legal drinking age ranges from 18 to 25 years depending
                    on the state. You must be of legal drinking age in your
                    jurisdiction to order alcohol.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Verification Methods</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Drinkly uses multiple verification methods to confirm your age:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-medium mb-2">1. Date of Birth</h3>
                <p className="text-sm text-neutral-500">
                  During registration, you provide your date of birth. This is
                  used to calculate your age and determine eligibility.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-medium mb-2">2. Government ID</h3>
                <p className="text-sm text-neutral-500">
                  You may upload a government-issued photo ID (passport,
                  driver&apos;s license, or national ID) for verification.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-medium mb-2">3. Delivery Verification</h3>
                <p className="text-sm text-neutral-500">
                  The delivery agent will verify your government-issued photo ID
                  upon delivery before handing over alcohol.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">What Happens If You Fail Verification?</h2>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
              <li>
                <strong>During Registration:</strong> You will not be able to
                create an account or use Drinkly services.
              </li>
              <li>
                <strong>During Checkout:</strong> Your order will not be
                processed until verification is complete.
              </li>
              <li>
                <strong>At Delivery:</strong> If you cannot provide valid ID or
                appear to be intoxicated, the delivery will be refused. No
                refund will be provided for refused deliveries.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Acceptable Forms of ID</h2>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>Valid Passport</li>
              <li>Driver&apos;s License</li>
              <li>National Identity Card (Aadhaar, etc.)</li>
              <li>Pan Card (with photo)</li>
              <li>Other government-issued photo identification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Privacy</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              All identity documents uploaded for age verification are processed
              securely and stored in compliance with applicable data protection
              laws. We only retain the minimum information necessary to verify
              your age and comply with legal requirements. For more details,
              please review our{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Responsible Drinking</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Drinkly promotes responsible alcohol consumption. We reserve the
              right to limit orders, refuse service, or suspend accounts that
              indicate excessive or problematic drinking behavior. If you or
              someone you know has a drinking problem, please seek help from
              appropriate support services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              For questions about our age verification policy, please contact
              us at{' '}
              <a href="mailto:verify@drinkly.com" className="text-blue-600 hover:underline">
                verify@drinkly.com
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
