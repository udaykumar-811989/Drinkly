'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface StoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  name: string
  logo?: string
  banner?: string
  rating?: number
  distance?: string
  isOpen?: boolean
  deliveryTime?: string
  minimumOrder?: number
}

function StoreCard({
  id,
  name,
  logo,
  banner,
  rating,
  distance,
  isOpen = true,
  deliveryTime,
  minimumOrder,
  className,
  ...props
}: StoreCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 cursor-pointer',
        !isOpen && 'opacity-75',
        className
      )}
      {...props}
    >
      <div className="relative h-32 overflow-hidden bg-muted">
        {banner ? (
          <Image
            src={banner}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/5 to-primary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="relative px-4 pb-4 -mt-8">
        <div className="flex items-end gap-3">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-background bg-background shadow-sm">
            {logo ? (
              <Image
                src={logo}
                alt={name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21h.008m11.14 0h.008M3.75 9.349h.008m11.14 0h.008M15 5.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-6 12.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            {rating !== undefined && (
              <div className="flex items-center gap-1 mt-0.5">
                <svg className="h-3.5 w-3.5 text-amber-500 fill-amber-500" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <Badge variant={isOpen ? 'success' : 'secondary'} size="sm">
            {isOpen ? 'Open' : 'Closed'}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          {distance && (
            <div className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {distance}
            </div>
          )}
          {deliveryTime && (
            <div className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {deliveryTime}
            </div>
          )}
          {minimumOrder !== undefined && (
            <div className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
              Min ${minimumOrder}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { StoreCard }
