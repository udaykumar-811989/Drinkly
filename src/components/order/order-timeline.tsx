import * as React from 'react'
import { cn } from '@/lib/utils'

type StepStatus = 'completed' | 'active' | 'pending'

interface TimelineStep {
  label: string
  description?: string
  timestamp?: string
  status: StepStatus
}

interface OrderTimelineProps {
  steps: TimelineStep[]
  className?: string
}

function OrderTimeline({ steps, className }: OrderTimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1

        return (
          <div key={index} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                  step.status === 'completed' && 'bg-primary border-primary text-primary-foreground',
                  step.status === 'active' && 'border-primary bg-primary/10 text-primary',
                  step.status === 'pending' && 'border-muted-foreground/30 bg-background text-muted-foreground'
                )}
              >
                {step.status === 'completed' ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 my-1',
                    step.status === 'completed' ? 'bg-primary' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>

            <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-medium',
                  step.status === 'completed' && 'text-foreground',
                  step.status === 'active' && 'text-primary',
                  step.status === 'pending' && 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              )}
              {step.timestamp && (
                <p className="text-xs text-muted-foreground mt-1">{step.timestamp}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { OrderTimeline }
