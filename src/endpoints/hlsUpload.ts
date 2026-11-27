import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { PayloadHandler } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const HLS_ROOT = path.resolve(dirname, '../../public/media/hls')
const ALLOWED_EXT = new Set(['.m3u8', '.ts', '.m4s', '.mp4', '.vtt'])

/**
 * Stores uploaded HLS playlist/segment files locally under public/media/hls/
 * when S3 is not configured. Requires an authenticated CMS user.
 */
export const uploadHlsLocalHandler: PayloadHandler = async (req) => {
  try {
    if (!req.user) {
      return Response.json({ error: 'Nicht autorisiert.' }, { status: 401 })
    }

    const url = new URL(req.url || 'http://localhost', 'http://localhost')
    const rawKey = url.searchParams.get('key') || ''
    const cleanRel = rawKey.replace(/^\/+/, '').replace(/^media\/hls\//, '')

    if (!cleanRel || cleanRel.includes('..') || cleanRel.includes('\\')) {
      return Response.json({ error: 'Ungültiger Dateipfad.' }, { status: 400 })
    }

    const ext = path.extname(cleanRel).toLowerCase()
    if (!ALLOWED_EXT.has(ext)) {
      return Response.json({ error: `Nicht unterstützter Dateityp: ${ext}` }, { status: 400 })
    }

    const dest = path.resolve(HLS_ROOT, cleanRel)
    if (!dest.startsWith(HLS_ROOT + path.sep)) {
      return Response.json({ error: 'Ungültiger Zielpfad.' }, { status: 400 })
    }

    const arrayBuf = await (req as unknown as Request).arrayBuffer()
    if (!arrayBuf || arrayBuf.byteLength === 0) {
      return Response.json({ error: 'Leere Datei.' }, { status: 400 })
    }

    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, Buffer.from(arrayBuf))

    return Response.json({ url: `/media/hls/${cleanRel}` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload fehlgeschlagen.'
    return Response.json({ error: message }, { status: 500 })
  }
}
