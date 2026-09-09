'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'full' | 'icon'
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-12',
}

function Logo({ variant = 'full', size = 'md', className, ...props }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeStyles[size], 'aspect-square')}
      >
        <rect width="40" height="40" rx="12" className="fill-primary" />
        <path
          d="M12 28V14c0-2 1.5-3.5 3.5-3.5h1c2 0 3.5 1.5 3.5 3.5v4c0 1 .5 2 1.5 2.5l1.5.8c1 .5 1.5 1.5 1.5 2.7V28"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="text-primary-foreground"
        />
        <circle cx="20" cy="30" r="2" className="fill-primary-foreground" opacity="0.6" />
      </svg>
      {variant === 'full' && (
        <span className={cn(
          'font-bold tracking-tight',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl'
        )}>
          <span className="text-primary">Drink</span>
          <span className="text-foreground">ly</span>
        </span>
      )}
    </div>
  )
}

export { Logo }
