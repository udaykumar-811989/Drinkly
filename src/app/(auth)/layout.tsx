import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Drinkly
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Order Responsibly. Delivered Legally.
            </p>
          </Link>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8">
          {children}
        </div>
        <p className="text-center text-xs text-neutral-500 mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-blue-600">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-blue-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
