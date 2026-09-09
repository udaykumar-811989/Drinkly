'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function VerifyPhonePage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[name="otp-${index + 1}"]`
      ) as HTMLInputElement
      nextInput?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name="otp-${index - 1}"]`
      ) as HTMLInputElement
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)
    const lastFilledIndex = Math.min(pastedData.length, 5)
    const nextInput = document.querySelector(
      `input[name="otp-${lastFilledIndex}"]`
    ) as HTMLInputElement
    nextInput?.focus()
  }

  const handleSubmit = useCallback(async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      // TODO: Implement actual OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch {
      setError('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [otp])

  const handleResend = async () => {
    setCanResend(false)
    setResendTimer(60)
    // TODO: Implement resend OTP logic
  }

  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      handleSubmit()
    }
  }, [otp, handleSubmit])

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Phone Verified!</h2>
        <p className="text-neutral-500 mb-6">
          Your phone number has been successfully verified.
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Continue to Login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      <h2 className="text-2xl font-bold text-center mb-2">Verify your phone</h2>
      <p className="text-neutral-500 text-center text-sm mb-8">
        Enter the 6-digit code sent to your phone number
      </p>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-3 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            name={`otp-${index}`}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            maxLength={1}
            className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || otp.join('').length !== 6}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify'
        )}
      </button>

      <div className="mt-6 text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline inline-flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            Resend OTP
          </button>
        ) : (
          <p className="text-sm text-neutral-500">
            Resend OTP in{' '}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {resendTimer}s
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
