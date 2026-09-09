'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, Calendar, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

export default function VerifyAgePage() {
  const [method, setMethod] = useState<'dob' | 'id'>('dob')
  const [dob, setDob] = useState('')
  const [idImage, setIdImage] = useState<File | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }
    return age
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (method === 'dob') {
      if (!dob) {
        setError('Please enter your date of birth')
        return
      }
      const age = calculateAge(dob)
      if (age < 18) {
        setError(
          'You must be of legal drinking age (18+) to use this service.'
        )
        return
      }
    } else {
      if (!idImage) {
        setError('Please upload your government ID')
        return
      }
    }

    if (!confirmed) {
      setError('Please confirm you are of legal drinking age')
      return
    }

    setLoading(true)
    try {
      // TODO: Implement actual age verification
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSuccess(true)
    } catch {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setIdImage(file)
      setError('')
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Age Verified!</h2>
        <p className="text-neutral-500 mb-6">
          Your age has been successfully verified. You can now use Drinkly.
        </p>
        <Link
          href="/home"
          className="inline-block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <h2 className="text-2xl font-bold">Age Verification Required</h2>
      </div>
      <p className="text-neutral-500 text-sm mb-6">
        Federal and state laws require us to verify that you are of legal
        drinking age before you can order alcohol.
      </p>

      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-6">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          <strong>Legal Notice:</strong> It is illegal to purchase or consume
          alcohol if you are under the legal drinking age. False identification
          is a criminal offense.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Verification Method Toggle */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Choose verification method:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod('dob')}
              className={`p-4 rounded-xl border text-left transition-all ${
                method === 'dob'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
              }`}
            >
              <Calendar className="w-5 h-5 mb-2 text-blue-600" />
              <p className="font-medium text-sm">Date of Birth</p>
              <p className="text-xs text-neutral-500">Confirm your DOB</p>
            </button>
            <button
              type="button"
              onClick={() => setMethod('id')}
              className={`p-4 rounded-xl border text-left transition-all ${
                method === 'id'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
              }`}
            >
              <Upload className="w-5 h-5 mb-2 text-blue-600" />
              <p className="font-medium text-sm">Government ID</p>
              <p className="text-xs text-neutral-500">Upload ID document</p>
            </button>
          </div>
        </div>

        {method === 'dob' && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value)
                setError('')
              }}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        {method === 'id' && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Government-issued ID
            </label>
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="id-upload"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="id-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 mx-auto mb-3 text-neutral-400" />
                {idImage ? (
                  <p className="text-sm font-medium text-green-600">
                    {idImage.name}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500">
                      Passport, Driver&apos;s License, or National ID (Max 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="confirm-age"
            checked={confirmed}
            onChange={(e) => {
              setConfirmed(e.target.checked)
              setError('')
            }}
            className="mt-1 rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="confirm-age"
            className="text-sm text-neutral-600 dark:text-neutral-400"
          >
            I confirm that I am of legal drinking age in my jurisdiction and
            that all information provided is accurate and true.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Age'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          I&apos;m not of legal drinking age. Exit Drinkly.
        </Link>
      </div>
    </div>
  )
}
