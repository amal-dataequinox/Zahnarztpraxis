'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { ApplicationForm } from './ApplicationForm'

type ApplyModalProps = {
  jobId: string
  jobTitle: string
  intro?: string | null
  successMessage?: string | null
  label?: string
  className?: string
}

export function ApplyModal({
  jobId,
  jobTitle,
  intro,
  successMessage,
  label = 'Jetzt bewerben',
  className,
}: ApplyModalProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    panel?.querySelector<HTMLButtonElement>('button')?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !panel) return

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), textarea, select, [tabindex="0"]',
        ),
      ).filter((el) => el.getClientRects().length > 0)

      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 font-sans text-base font-semibold text-white shadow-sm transition-all duration-200 hover:brightness-95 hover:-translate-y-0.5'
        }
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-accent-text, #ffffff)',
        }}
      >
        <span>{label}</span>
        <span aria-hidden="true">↗</span>
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex justify-end">
              <div
                className="fixed inset-0 bg-[#07181b]/60 backdrop-blur-xs transition-opacity"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
              >
                <header className="flex items-start justify-between gap-4 border-b border-black/[0.08] bg-[#f7faf9] px-6 py-5">
                  <div>
                    <p className="m-0 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                      Ihre Bewerbung
                    </p>
                    <h2
                      id={titleId}
                      className="mt-1 mb-1 font-display text-xl sm:text-2xl font-semibold text-[#0e2a2f]"
                    >
                      {jobTitle}
                    </h2>
                    <span className="inline-block rounded-full border border-black/[0.08] bg-white px-2.5 py-0.5 font-sans text-xs font-medium text-[#52686c]">
                      {jobId}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Bewerbungsformular schliessen"
                    onClick={() => setOpen(false)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.1] bg-white text-[#0e2a2f] hover:bg-black/[0.04]"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {intro ? (
                    <p className="mt-0 mb-5 rounded-xl border border-black/[0.06] bg-[#f7faf9] px-4 py-3 font-sans text-xs leading-relaxed text-[#4f6468]">
                      {intro}
                    </p>
                  ) : null}
                  <ApplicationForm
                    jobId={jobId}
                    jobTitle={jobTitle}
                    successMessage={successMessage}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
