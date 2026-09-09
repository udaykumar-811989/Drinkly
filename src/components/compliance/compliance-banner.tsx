'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ComplianceBannerProps {
  onDismiss?: () => void
}

function ComplianceBanner({ onDismiss }: ComplianceBannerProps) {
  const [dismissed, setDismissed] = React.useState(false)

  if (dismissed) return null

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Drink responsibly.</strong> You must be 21+ to purchase alcoholic beverages. 
              All deliveries require age verification upon receipt.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200"
            onClick={() => {
              setDismissed(true)
              onDismiss?.()
            }}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ComplianceBanner }
