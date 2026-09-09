'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { calculateAge } from '@/lib/utils'

interface AgeGateProps {
  onVerified?: () => void
}

function AgeGate({ onVerified }: AgeGateProps) {
  const [day, setDay] = React.useState('')
  const [month, setMonth] = React.useState('')
  const [year, setYear] = React.useState('')
  const [checkboxChecked, setCheckboxChecked] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isVerifying, setIsVerifying] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!day || !month || !year) {
      setError('Please enter your complete date of birth')
      return
    }

    if (!checkboxChecked) {
      setError('Please confirm you are of legal drinking age')
      return
    }

    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    if (isNaN(birthDate.getTime())) {
      setError('Please enter a valid date of birth')
      return
    }

    const age = calculateAge(birthDate)

    if (age < 21) {
      setError('You must be 21 or older to access this site')
      return
    }

    setIsVerifying(true)
    setTimeout(() => {
      localStorage.setItem('drinkly_age_verified', 'true')
      onVerified?.()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-2xl border bg-card p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Age Verification</h1>
            <p className="text-sm text-muted-foreground mt-2">
              You must be 21 years or older to access this website.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Date of Birth
              </label>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="DD"
                  value={day}
                  onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  maxLength={2}
                  className="text-center"
                />
                <Input
                  placeholder="MM"
                  value={month}
                  onChange={(e) => setMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  maxLength={2}
                  className="text-center"
                />
                <Input
                  placeholder="YYYY"
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className="text-center"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-input"
              />
              <span className="text-sm text-muted-foreground">
                I confirm that I am of legal drinking age in my country/state and agree to the Terms of Service.
              </span>
            </label>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isVerifying}
            >
              Enter Site
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By entering, you agree to our Age Policy and Terms of Service.
              Please drink responsibly.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export { AgeGate }
