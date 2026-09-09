'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Phone } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (loginMethod === 'email') {
        if (!email || !password) {
          setError('Please fill in all fields')
          setLoading(false)
          return
        }
      } else {
        if (!email) {
          setError('Please enter your phone number')
          setLoading(false)
          return
        }
      }
      // TODO: Implement actual login logic
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Welcome back</h2>
      <p className="text-neutral-500 text-center text-sm mb-6">
        Sign in to your account to continue
      </p>

      {/* Login Method Toggle */}
      <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-6">
        <button
          onClick={() => setLoginMethod('email')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            loginMethod === 'email'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setLoginMethod('phone')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            loginMethod === 'phone'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Phone / OTP
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">
            {loginMethod === 'email' ? 'Email address' : 'Phone number'}
          </label>
          <input
            type={loginMethod === 'email' ? 'email' : 'tel'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              loginMethod === 'email' ? 'you@example.com' : '+91 98765 43210'
            }
            className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {loginMethod === 'email' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium">Password</label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}

        {loginMethod === 'phone' && (
          <p className="text-sm text-neutral-500">
            We&apos;ll send a one-time password to your phone number.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {loginMethod === 'phone' ? 'Sending OTP...' : 'Signing in...'}
            </>
          ) : loginMethod === 'phone' ? (
            <>
              <Phone className="w-5 h-5" />
              Send OTP
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
