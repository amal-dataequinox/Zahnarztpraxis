import { AppointmentCTA } from '@/design-system'

type BookingPlaceholderProps = {
  className?: string
  label?: string
  /** Hide the placeholder disclaimer (e.g. hero — keep one cyan CTA clean). */
  compact?: boolean
}

/**
 * Identifiable booking CTA that does not claim online booking works.
 * Wire real Denteo / scheduler URLs only after practice confirmation.
 */
export function BookingPlaceholder({
  className,
  label = 'Termin anfragen',
  compact = false,
}: BookingPlaceholderProps) {
  return (
    <AppointmentCTA
      href="/kontakt#termin"
      label={label}
      supporting={
        compact ? undefined : 'Platzhalter — Online-Buchung folgt nach Freigabe.'
      }
      className={className}
    />
  )
}
