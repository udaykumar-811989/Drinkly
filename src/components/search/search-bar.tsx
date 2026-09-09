'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (query: string) => void
  recentSearches?: string[]
  popularSearches?: string[]
  onClearRecent?: () => void
}

function SearchBar({
  onSearch,
  recentSearches = [],
  popularSearches = [],
  onClearRecent,
  className,
  ...props
}: SearchBarProps) {
  const [query, setQuery] = React.useState('')
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (value: string) => {
    setQuery(value)
    onSearch?.(value)
    setShowSuggestions(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)} {...props}>
      <form onSubmit={handleSubmit} className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search drinks, brands, stores..."
          className="flex h-12 w-full rounded-xl border bg-background pl-10 pr-12 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        />
        {query && (
          <button
            type="button"
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </form>

      {showSuggestions && (recentSearches.length > 0 || popularSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border bg-popover p-2 shadow-xl z-50">
          {recentSearches.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-medium text-muted-foreground">Recent</span>
                {onClearRecent && (
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={onClearRecent}
                  >
                    Clear
                  </button>
                )}
              </div>
              {recentSearches.slice(0, 5).map((search) => (
                <button
                  key={search}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  onClick={() => handleSuggestionClick(search)}
                >
                  <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {search}
                </button>
              ))}
            </div>
          )}

          {popularSearches.length > 0 && (
            <div>
              <span className="px-2 py-1 text-xs font-medium text-muted-foreground">Popular</span>
              <div className="flex flex-wrap gap-1.5 mt-1 px-2 pb-1">
                {popularSearches.slice(0, 8).map((search) => (
                  <button
                    key={search}
                    className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { SearchBar }
