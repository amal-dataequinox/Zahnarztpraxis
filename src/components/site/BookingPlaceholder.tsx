import { AppointmentCTA } from '@/design-system'
import type { Location } from '@/payload-types'

type BookingPlaceholderProps = {
  className?: string
  label?: string
  compact?: boolean
  location?: Location
}

export function BookingPlaceholder({
  className,
  label = 'Termin anfragen',
  compact = false,
  location,
}: BookingPlaceholderProps) {
  const href = location?.bookingUrl || '/kontakt#termin'
  return (
    <AppointmentCTA
      href={href}
      label={label}
      supporting={compact ? undefined : undefined}
      className={className}
    />
  )
}
