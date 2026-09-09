'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  onCheckAvailability?: () => void
}

function Hero({ className, onCheckAvailability, ...props }: HeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Premium Delivery
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Your drinks.
                <br />
                <span className="text-primary">Your choice.</span>
                <br />
                Delivered responsibly.
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Browse from hundreds of local retailers. Verified age. Compliance guaranteed. 
                From craft beer to fine wine, we deliver it all.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={onCheckAvailability} className="shadow-lg shadow-primary/25">
                Check Availability
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Button>
              <Button size="lg" variant="outline">
                Browse Categories
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Age Verified
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                500+ Retailers
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                30min Delivery
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/60 border border-white/5">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🍷</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Reserve Cabernet 2018</p>
                    <p className="text-sm text-muted-foreground">Napa Valley • $42.99</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/60 border border-white/5">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🍺</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Craft IPA Six-Pack</p>
                    <p className="text-sm text-muted-foreground">Local Brewery • $14.99</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/60 border border-white/5">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🥃</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Highland Single Malt</p>
                    <p className="text-sm text-muted-foreground">Scotland • $67.50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
