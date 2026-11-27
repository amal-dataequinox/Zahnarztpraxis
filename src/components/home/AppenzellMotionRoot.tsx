'use client'

import type { ReactNode } from 'react'

import { AlpineScrollBridge } from '@/components/motion/AlpineScrollBridge'
import { MotionControl } from '@/components/motion/MotionControl'
import { MotionProvider } from '@/components/motion/MotionProvider'

/**
 * Client shell for Appenzell homepage motion: provider, scroll bridge, control.
 */
export function AppenzellMotionRoot({
  children,
  motionEnabled = true,
}: {
  children: ReactNode
  motionEnabled?: boolean
}) {
  return (
    <MotionProvider>
      <div className={motionEnabled ? 'appenzell-home' : 'appenzell-home is-paused'}>
        {children}
        {motionEnabled ? (
          <>
            <AlpineScrollBridge nextId="praxis" />
            <MotionControl />
          </>
        ) : null}
      </div>
    </MotionProvider>
  )
}
