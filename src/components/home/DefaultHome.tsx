import React from 'react'

import { AppenzellHome } from '@/components/home/AppenzellHome'
import type { LocationOption } from '@/design-system/components/LocationSwitcher'
import type { Location } from '@/payload-types'
import { getLocationSwitcherOptions } from '@/utilities/locationSwitcher'

type DefaultHomeProps = {
  location: Location
  locationOptions?: LocationOption[]
}

/**
 * Dedicated Appenzell Dental Clinic Homepage
 */
export async function DefaultHome({ location, locationOptions }: DefaultHomeProps) {
  const options = locationOptions ?? getLocationSwitcherOptions()
  return <AppenzellHome location={location} locationOptions={options} />
}
