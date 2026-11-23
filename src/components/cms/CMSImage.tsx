import Image from 'next/image'
import React from 'react'

import type { Media } from '@/payload-types'
import { getMediaAlt, getMediaUrl, isMedia } from '@/utilities/media'
import { cn } from '@/design-system/lib/cn'

type CMSImageProps = {
  media: Media | number | null | undefined
  size?: 'thumbnail' | 'card' | 'hero'
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
}

export function CMSImage({
  media,
  size = 'card',
  className,
  priority,
  fill,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: CMSImageProps) {
  if (!isMedia(media)) return null
  const src = getMediaUrl(media, size)
  if (!src) return null

  const alt = getMediaAlt(media)

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', className)}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={media.width || 1600}
      height={media.height || 1067}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-full', className)}
    />
  )
}
