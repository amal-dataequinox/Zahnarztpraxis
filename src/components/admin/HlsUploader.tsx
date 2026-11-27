'use client'

import React, { useState } from 'react'
import { useForm, useFormFields } from '@payloadcms/ui'
import JSZip from 'jszip'

export const HlsUploader: React.FC = () => {
  const { dispatchFields } = useForm()
  const hlsUrlField = useFormFields(([fields]) => fields.hlsUrl)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [directUrl, setDirectUrl] = useState<string>((hlsUrlField?.value as string) || '')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleDirectUrlApply = (val: string) => {
    setDirectUrl(val)
    dispatchFields({ type: 'UPDATE', path: 'mediaType', value: 'hls' })
    dispatchFields({ type: 'UPDATE', path: 'hlsUrl', value: val.trim() })
  }

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!posterFile) {
      setError('Bitte zuerst ein Vorschaubild (Cover) auswählen.')
      e.target.value = ''
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      const zip = new JSZip()
      const contents = await zip.loadAsync(file)
      const entries = Object.values(contents.files).filter(
        (entry) => !entry.dir && !entry.name.startsWith('__MACOSX/'),
      )

      if (entries.length === 0) {
        throw new Error('Die ZIP-Datei ist leer oder ungültig.')
      }

      const folderName = file.name.replace(/\.zip$/i, '').replace(/[^a-zA-Z0-9_-]/g, '-')
      let m3u8Url = ''
      let completed = 0
      const total = entries.length

      const contentTypeForName = (name: string) => {
        const lower = name.toLowerCase()
        if (lower.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl'
        if (lower.endsWith('.ts')) return 'video/mp2t'
        if (lower.endsWith('.m4s')) return 'video/iso.segment'
        if (lower.endsWith('.mp4')) return 'video/mp4'
        if (lower.endsWith('.vtt')) return 'text/vtt'
        return 'application/octet-stream'
      }

      for (const entry of entries) {
        const fileData = await entry.async('blob')
        const cleanEntryName = entry.name.replace(/^\/+/, '')
        const relKey = `${folderName}/${cleanEntryName}`
        const s3Key = `media/hls/${relKey}`
        const contentType = contentTypeForName(cleanEntryName)
        let uploadedUrl = ''

        const presignRes = await fetch('/api/get-presigned-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: s3Key, contentType }),
        })

        if (presignRes.ok) {
          const { url, baseUrl } = (await presignRes.json()) as { url: string; baseUrl: string }
          const putRes = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            body: fileData,
          })
          if (!putRes.ok) {
            throw new Error(`Fehler beim S3-Upload von ${cleanEntryName}`)
          }
          uploadedUrl = `${baseUrl.replace(/\/+$/, '')}/${s3Key}`
        } else if (presignRes.status === 501) {
          const uploadRes = await fetch(`/api/hls-upload?key=${encodeURIComponent(relKey)}`, {
            method: 'POST',
            body: fileData,
          })
          if (!uploadRes.ok) {
            const errData = await uploadRes.json().catch(() => ({}))
            throw new Error(errData.error || `Fehler beim Hochladen von ${cleanEntryName}`)
          }
          const { url } = (await uploadRes.json()) as { url: string }
          uploadedUrl = url
        } else {
          const errData = await presignRes.json().catch(() => ({}))
          throw new Error(errData.error || `Presigned URL fehlgeschlagen für ${cleanEntryName}`)
        }

        if (cleanEntryName.endsWith('.m3u8')) {
          if (!m3u8Url || !cleanEntryName.includes('/')) {
            m3u8Url = uploadedUrl
          }
        }

        completed++
        setProgress(Math.round((completed / total) * 100))
      }

      if (!m3u8Url) {
        throw new Error('Keine .m3u8-Playlist in der ZIP-Datei gefunden.')
      }

      dispatchFields({ type: 'UPDATE', path: 'file', value: posterFile })
      dispatchFields({ type: 'UPDATE', path: 'mediaType', value: 'hls' })
      dispatchFields({ type: 'UPDATE', path: 'hlsUrl', value: m3u8Url })
      setDirectUrl(m3u8Url)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload fehlgeschlagen.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        marginTop: '1.5rem',
        marginBottom: '1.5rem',
        padding: '1.25rem',
        border: '1px solid var(--theme-elevation-200)',
        borderRadius: '6px',
        backgroundColor: 'var(--theme-elevation-50)',
      }}
    >
      <label className="field-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
        HLS-Stream Upload (Adaptive Streaming wie DEQX)
      </label>
      <p style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-500)', marginBottom: '1rem' }}>
        Laden Sie ein HLS-Paket (.zip mit .m3u8 Playlist & .ts Segmenten) zusammen mit einem
        Vorschaubild hoch, oder geben Sie direkt eine bestehende .m3u8 Stream-URL ein.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>
          1. Vorschaubild (Cover Image) auswählen
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={uploading}
          onChange={(event) => {
            const f = event.target.files?.[0] || null
            if (f && !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(f.type)) {
              setError('Bitte ein JPEG-, PNG-, WebP- oder AVIF-Bild wählen.')
              setPosterFile(null)
              return
            }
            setPosterFile(f)
            setError(null)
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>
          2. HLS .zip Archiv hochladen
        </label>
        <input type="file" accept=".zip,application/zip" onChange={handleZipUpload} disabled={uploading} />
      </div>

      <div style={{ borderTop: '1px solid var(--theme-elevation-150)', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>
          Oder direkt eine HLS .m3u8 URL setzen
        </label>
        <input
          type="text"
          value={directUrl}
          placeholder="https://.../master.m3u8 oder /media/hls/.../master.m3u8"
          disabled={uploading}
          onChange={(e) => handleDirectUrlApply(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-250)',
            backgroundColor: 'var(--theme-input-bg)',
            color: 'var(--theme-text)',
          }}
        />
      </div>

      {uploading && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ width: '100%', backgroundColor: 'var(--theme-elevation-200)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, backgroundColor: 'var(--theme-success-500)', height: '100%', transition: 'width 0.2s' }} />
          </div>
          <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
            Hochladen & Entpacken... {progress}%
          </span>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '0.75rem', color: 'var(--theme-error-500)', fontSize: '0.875rem' }}>
          Fehler: {error}
        </div>
      )}

      {success && (
        <div style={{ marginTop: '0.75rem', color: 'var(--theme-success-500)', fontSize: '0.875rem' }}>
          HLS-Paket erfolgreich hochgeladen! Bitte oben auf «Speichern» klicken.
        </div>
      )}
    </div>
  )
}
