'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

type ApplicationFormProps = {
  jobId: string
  jobTitle: string
  successMessage?: string | null
}

const MAX_FILE_BYTES = 2 * 1024 * 1024

export function ApplicationForm({ jobId, jobTitle, successMessage }: ApplicationFormProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    hasPortfolio: 'no',
    additionalComments: '',
  })
  const [file, setFile] = useState<File | null>(null)

  const prefix = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [step, success])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const candidate = e.target.files?.[0]
    if (!candidate) return
    if (candidate.size > MAX_FILE_BYTES || !/\.(pdf|doc|docx)$/i.test(candidate.name)) {
      setError('Bitte wählen Sie eine PDF-, DOC- oder DOCX-Datei bis maximal 2 MB.')
      setFile(null)
      e.target.value = ''
      return
    }
    setFile(candidate)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return

    if (step === 1) {
      if (
        !values.fullName.trim() ||
        !values.email.trim() ||
        !values.phone.trim() ||
        !values.address.trim()
      ) {
        setError('Bitte füllen Sie alle mit * markierten Pflichtfelder aus.')
        return
      }
      setError(null)
      setStep(2)
      return
    }

    if (!file) {
      setError('Bitte laden Sie Ihren Lebenslauf hoch, bevor Sie die Bewerbung absenden.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('jobId', jobId)
      formData.append('fullName', values.fullName.trim())
      formData.append('email', values.email.trim())
      formData.append('phone', values.phone.trim())
      formData.append('address', values.address.trim())
      formData.append('linkedin', values.linkedin.trim())
      formData.append('hasPortfolio', String(values.hasPortfolio === 'yes'))
      formData.append('additionalComments', values.additionalComments.trim())
      formData.append('resume', file)

      const response = await fetch('/api/apply', {
        method: 'POST',
        body: formData,
      })

      const result = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        throw new Error(result.error || 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.')
      }

      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.06] p-6"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 ref={headingRef} tabIndex={-1} className="m-0 font-display text-2xl font-semibold text-[#0e2a2f] focus:outline-none">
          Bewerbung eingegangen.
        </h3>
        <p className="m-0 font-sans text-sm leading-relaxed text-[#4f6468]">
          {successMessage ||
            'Vielen Dank für Ihre Bewerbung. Unser Praxisteam hat Ihre Unterlagen erhalten und meldet sich zeitnah bei Ihnen.'}
        </p>
        <p className="m-0 rounded-full border border-black/[0.08] bg-white px-3 py-1 font-sans text-xs font-medium text-[#0e2a2f]">
          {jobTitle} · {jobId}
        </p>
      </div>
    )
  }

  const stepOneFields = [
    {
      name: 'fullName',
      label: 'Vollständiger Name',
      type: 'text',
      autoComplete: 'name',
      placeholder: 'Vorname Nachname',
      required: true,
    },
    {
      name: 'email',
      label: 'E-Mail-Adresse',
      type: 'email',
      autoComplete: 'email',
      placeholder: 'name@beispiel.ch',
      required: true,
    },
    {
      name: 'phone',
      label: 'Telefonnummer',
      type: 'tel',
      autoComplete: 'tel',
      placeholder: '+41 79 000 00 00',
      required: true,
    },
    {
      name: 'address',
      label: 'Wohnadresse',
      type: 'text',
      autoComplete: 'street-address',
      placeholder: 'Strasse, PLZ Ort',
      required: true,
    },
    {
      name: 'linkedin',
      label: 'LinkedIn / Profil-Link (optional)',
      type: 'url',
      autoComplete: 'url',
      placeholder: 'https://linkedin.com/in/ihr-profil',
      required: false,
      wide: true,
    },
  ] as const

  return (
    <form onSubmit={handleSubmit} aria-busy={submitting} className="flex flex-col gap-5">
      <ol
        aria-label="Bewerbungsfortschritt"
        className="m-0 grid list-none grid-cols-2 gap-2 p-0"
      >
        <li
          aria-current={step === 1 ? 'step' : undefined}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 font-sans text-xs font-semibold ${
            step === 1
              ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.08] text-[#0e2a2f]'
              : 'border-black/[0.07] bg-[#f7faf9] text-[#52686c]'
          }`}
        >
          <span className="text-[var(--color-accent)]">01</span>
          <span>Ihre Angaben</span>
        </li>
        <li
          aria-current={step === 2 ? 'step' : undefined}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 font-sans text-xs font-semibold ${
            step === 2
              ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.08] text-[#0e2a2f]'
              : 'border-black/[0.07] bg-[#f7faf9] text-[#52686c]'
          }`}
        >
          <span className="text-[var(--color-accent)]">02</span>
          <span>Lebenslauf & Prüfung</span>
        </li>
      </ol>

      <div>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="m-0 font-display text-xl font-semibold text-[#0e2a2f] focus:outline-none"
        >
          {step === 1 ? 'Persönliche Angaben' : 'Unterlagen hochladen & prüfen'}
        </h3>
        <p className="mt-1 mb-0 font-sans text-xs text-[#52686c]">
          {step === 1
            ? 'Felder mit * sind Pflichtfelder.'
            : 'PDF, DOC oder DOCX — maximale Dateigrösse: 2 MB.'}
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="m-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-xs font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}

      {step === 1 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stepOneFields.map((field) => (
            <label
              key={field.name}
              htmlFor={`${prefix}-${field.name}`}
              className={`flex flex-col gap-1.5 ${'wide' in field && field.wide ? 'sm:col-span-2' : ''}`}
            >
              <span className="font-sans text-xs font-semibold text-[#0e2a2f]">
                {field.label}
                {field.required ? ' *' : ''}
              </span>
              <input
                id={`${prefix}-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={handleChange}
                required={field.required}
                className="min-h-11 w-full rounded-xl border border-black/[0.12] bg-white px-3.5 font-sans text-sm text-[#0e2a2f] placeholder:text-[#8aa0a4] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </label>
          ))}

          <fieldset className="sm:col-span-2 flex flex-col gap-2 border-0 p-0 m-0">
            <legend className="font-sans text-xs font-semibold text-[#0e2a2f] mb-1">
              Haben Sie zusätzliche Zertifikate / Arbeitszeugnisse?
            </legend>
            <div className="flex gap-3">
              {[
                { value: 'yes', label: 'Ja' },
                { value: 'no', label: 'Nein' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 font-sans text-sm ${
                    values.hasPortfolio === option.value
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/[0.08] font-semibold text-[#0e2a2f]'
                      : 'border-black/[0.1] bg-white text-[#4f6468]'
                  }`}
                >
                  <input
                    type="radio"
                    name="hasPortfolio"
                    value={option.value}
                    checked={values.hasPortfolio === option.value}
                    onChange={handleChange}
                    className="accent-[var(--color-accent)]"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <label
            htmlFor={`${prefix}-resume`}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--color-accent)]/35 bg-[#f7faf9] px-4 py-6 text-center transition-colors hover:border-[var(--color-accent)]"
          >
            <svg
              className="h-7 w-7 text-[var(--color-accent)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.06em] text-[#52686c]">
              Lebenslauf / Unterlagen *
            </span>
            <strong className="font-sans text-sm font-semibold text-[#0e2a2f]">
              {file ? file.name : 'PDF, DOC oder DOCX auswählen'}
            </strong>
            <input
              id={`${prefix}-resume`}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          <label htmlFor={`${prefix}-comments`} className="flex flex-col gap-1.5">
            <span className="font-sans text-xs font-semibold text-[#0e2a2f]">
              Nachricht / Begleittext <small className="font-normal text-[#52686c]">(optional)</small>
            </span>
            <textarea
              id={`${prefix}-comments`}
              name="additionalComments"
              value={values.additionalComments}
              onChange={handleChange}
              rows={3}
              placeholder="Teilen Sie uns gerne Ihren möglichen Eintrittstermin oder weitere Hinweise mit."
              className="w-full rounded-xl border border-black/[0.12] bg-white p-3 font-sans text-sm text-[#0e2a2f] placeholder:text-[#8aa0a4] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </label>

          <div className="rounded-xl border border-black/[0.07] bg-[#f7faf9] p-4">
            <h4 className="m-0 mb-2.5 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[#52686c]">
              Ihre Angaben im Überblick
            </h4>
            <dl className="m-0 grid grid-cols-1 gap-1.5 font-sans text-xs sm:grid-cols-2">
              <div>
                <dt className="text-[#698084]">Stelle</dt>
                <dd className="m-0 font-medium text-[#0e2a2f]">{jobTitle}</dd>
              </div>
              <div>
                <dt className="text-[#698084]">Name</dt>
                <dd className="m-0 font-medium text-[#0e2a2f]">{values.fullName}</dd>
              </div>
              <div>
                <dt className="text-[#698084]">E-Mail</dt>
                <dd className="m-0 font-medium text-[#0e2a2f]">{values.email}</dd>
              </div>
              <div>
                <dt className="text-[#698084]">Telefon</dt>
                <dd className="m-0 font-medium text-[#0e2a2f]">{values.phone}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[#698084]">Adresse</dt>
                <dd className="m-0 font-medium text-[#0e2a2f]">{values.address}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-black/[0.07]">
        {step === 2 ? (
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setError(null)
              setStep(1)
            }}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-black/[0.12] bg-white px-4 font-sans text-sm font-semibold text-[#0e2a2f] hover:border-black/25 disabled:opacity-50"
          >
            <span aria-hidden="true">←</span>
            <span>Zurück</span>
          </button>
        ) : (
          <span />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-6 font-sans text-sm font-semibold text-white transition-all hover:brightness-95 disabled:opacity-60"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-text, #ffffff)',
          }}
        >
          {submitting
            ? 'Wird gesendet…'
            : step === 1
              ? 'Weiter zu Schritt 2 →'
              : 'Bewerbung absenden'}
        </button>
      </div>
    </form>
  )
}
