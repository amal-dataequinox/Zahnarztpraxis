'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

type ThemeSelectProps = {
  label: string
  value: string
  placeholder: string
  options: string[]
  onChange: (next: string) => void
}

/**
 * Custom Palatty-themed dropdown menu replacing native OS <select> pickers
 * so mobile & desktop browsers render consistent Swiss-Modern UI.
 */
export function ThemeSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: ThemeSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const labelId = useId()
  const listboxId = useId()

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const allItems = [{ value: '', text: placeholder }, ...options.map((opt) => ({ value: opt, text: opt }))]
  const activeText = value || placeholder

  return (
    <div ref={rootRef} className="relative flex flex-col gap-1.5">
      <span
        id={labelId}
        className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#52686c]"
      >
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 font-sans text-sm text-left transition-all duration-200 ${
          open
            ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/15 text-[#0e2a2f]'
            : 'border-black/[0.09] text-[#0e2a2f] hover:border-[var(--color-accent)]/50'
        }`}
      >
        <span className="truncate font-medium">{activeText}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 m-0 max-h-64 list-none overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-1.5 shadow-[0_18px_42px_-12px_rgba(14,42,47,0.22)]"
        >
          {allItems.map((item) => {
            const selected = item.value === value
            return (
              <li key={item.value || '__all'} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(item.value)
                    setOpen(false)
                    triggerRef.current?.focus()
                  }}
                  className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left font-sans text-sm transition-colors ${
                    selected
                      ? 'bg-[var(--color-accent)]/[0.11] font-semibold text-[#11423e]'
                      : 'text-[#31494d] hover:bg-[#f4faf8] hover:text-[#0e2a2f]'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full transition-opacity ${
                        selected ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ backgroundColor: 'var(--color-accent)' }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.text}</span>
                  </span>
                  {selected ? (
                    <svg
                      className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
