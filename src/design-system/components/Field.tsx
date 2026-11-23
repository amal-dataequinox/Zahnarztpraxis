import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

import { cn } from '@/design-system/lib/cn'

type LabelProps = {
  htmlFor?: string
  children: ReactNode
  optional?: boolean
  className?: string
}

export function Label({ htmlFor, children, optional, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'font-sans text-[length:var(--text-sm)] font-medium text-[var(--color-fg)]',
        className,
      )}
    >
      {children}
      {optional ? (
        <span className="ml-2 font-normal text-[var(--color-fg-subtle)]">optional</span>
      ) : null}
    </label>
  )
}

type HintProps = {
  children: ReactNode
  className?: string
  tone?: 'muted' | 'danger'
}

export function FieldHint({ children, className, tone = 'muted' }: HintProps) {
  return (
    <p
      className={cn(
        'font-sans text-[length:var(--text-sm)]',
        tone === 'muted' ? 'text-[var(--color-fg-subtle)]' : 'text-[var(--palatty-danger)]',
        className,
      )}
    >
      {children}
    </p>
  )
}

const controlBase =
  'w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--palatty-snow)] px-3.5 py-2.5 font-sans text-[length:var(--text-base)] text-[var(--color-fg)] transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)] placeholder:text-[var(--color-fg-subtle)] focus-visible:border-[var(--palatty-focus)] disabled:opacity-50'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export function Input({ className, invalid, ...rest }: InputProps) {
  return (
    <input
      className={cn(
        controlBase,
        invalid && 'border-[var(--palatty-danger)] focus-visible:border-[var(--palatty-danger)]',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
}

export function Textarea({ className, invalid, ...rest }: TextareaProps) {
  return (
    <textarea
      className={cn(
        controlBase,
        'min-h-32 resize-y',
        invalid && 'border-[var(--palatty-danger)] focus-visible:border-[var(--palatty-danger)]',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean
}

export function Select({ className, invalid, children, ...rest }: SelectProps) {
  return (
    <select
      className={cn(
        controlBase,
        'appearance-none bg-[length:1rem] bg-[right_0.85rem_center] bg-no-repeat pr-10',
        invalid && 'border-[var(--palatty-danger)] focus-visible:border-[var(--palatty-danger)]',
        className,
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%233f453f' stroke-width='1.5'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")`,
      }}
      aria-invalid={invalid || undefined}
      {...rest}
    >
      {children}
    </select>
  )
}

type FieldProps = {
  children: ReactNode
  className?: string
}

export function Field({ children, className }: FieldProps) {
  return <div className={cn('flex flex-col gap-2', className)}>{children}</div>
}
