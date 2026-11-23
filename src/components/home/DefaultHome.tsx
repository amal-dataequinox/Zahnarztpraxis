import React from 'react'

import { AppenzellHome } from '@/components/home/AppenzellHome'
import { GaisHome } from '@/components/home/GaisHome'
import type { LocationOption } from '@/design-system/components/LocationSwitcher'
import type { Location } from '@/payload-types'
import { getLocationSwitcherOptions, locationSlug } from '@/utilities/locationSwitcher'

type DefaultHomeProps = {
  location: Location
  locationOptions?: LocationOption[]
}

/**
 * Routes to the location homepage composition.
 * Appenzell is the visual reference; Gais stays a structural mirror until
 * Appenzell is approved, then the same language is applied.
 */
export async function DefaultHome({ location, locationOptions }: DefaultHomeProps) {
  const options = locationOptions ?? getLocationSwitcherOptions()
  const slug = locationSlug(location)

  if (slug === 'gais') {
    return <GaisHome location={location} locationOptions={options} />
  }

  return <AppenzellHome location={location} locationOptions={options} />
}
