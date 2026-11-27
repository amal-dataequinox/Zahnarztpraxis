'use client'

import React, { useEffect, useRef } from 'react'
import { useFormFields } from '@payloadcms/ui'
import type Hls from 'hls.js'

export const MediaPreview: React.FC = () => {
  const urlField = useFormFields(([fields]) => fields.url)
  const mediaTypeField = useFormFields(([fields]) => fields.mediaType)
  const hlsUrlField = useFormFields(([fields]) => fields.hlsUrl)

  const url = urlField?.value as string | undefined
  const mediaType = mediaTypeField?.value as string | undefined
  const hlsUrl = hlsUrlField?.value as string | undefined

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (mediaType !== 'hls' || !hlsUrl || !videoRef.current) return
    const video = videoRef.current
    let disposed = false
    let player: Hls | undefined

    async function attach() {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl!
      } else {
        const { default: HlsPlayer } = await import('hls.js')
        if (disposed || !HlsPlayer.isSupported()) return
        player = new HlsPlayer()
        player.loadSource(hlsUrl!)
        player.attachMedia(video)
      }
    }
    void attach()

    return () => {
      disposed = true
      player?.destroy()
    }
  }, [mediaType, hlsUrl])

  if (!url && !hlsUrl) return null

  return (
    <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
      <label className="field-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
        Vorschau
      </label>

      {mediaType === 'image' && url && (
        <img
          src={url}
          alt="Vorschau"
          style={{
            maxWidth: '100%',
            maxHeight: '360px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-200)',
          }}
        />
      )}

      {mediaType === 'video' && url && (
        <video
          controls
          src={url}
          style={{
            maxWidth: '100%',
            maxHeight: '360px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-200)',
          }}
        />
      )}

      {mediaType === 'hls' && (
        <video
          ref={videoRef}
          controls
          poster={url}
          style={{
            maxWidth: '100%',
            maxHeight: '360px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-200)',
          }}
        />
      )}
    </div>
  )
}
