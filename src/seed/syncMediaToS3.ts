import 'dotenv/config'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const MEDIA_DIR = path.resolve(dirname, '../../media')
const HLS_DIR = path.resolve(dirname, '../../public/media/hls')

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t',
  '.m4s': 'video/iso.segment',
  '.vtt': 'text/vtt',
}

async function listFilesRecursive(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const results: string[] = []
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        results.push(...(await listFilesRecursive(fullPath)))
      } else if (entry.isFile()) {
        results.push(fullPath)
      }
    }
    return results
  } catch {
    return []
  }
}

async function main() {
  const bucket = process.env.S3_BUCKET?.trim()
  if (!bucket) {
    throw new Error('S3_BUCKET ist nicht gesetzt. Bitte S3_BUCKET, S3_REGION und Zugangsdaten konfigurieren.')
  }

  const region = process.env.S3_REGION || 'eu-central-2'
  const s3 = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT } : {}),
  })

  const mediaFiles = await listFilesRecursive(MEDIA_DIR)
  const hlsFiles = await listFilesRecursive(HLS_DIR)

  let uploaded = 0

  for (const filePath of mediaFiles) {
    const rel = path.relative(MEDIA_DIR, filePath).split(path.sep).join('/')
    const key = `media/${rel}`
    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_BY_EXT[ext] || 'application/octet-stream'
    const body = await fs.readFile(filePath)

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    )
    uploaded++
  }

  for (const filePath of hlsFiles) {
    const rel = path.relative(HLS_DIR, filePath).split(path.sep).join('/')
    const key = `media/hls/${rel}`
    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_BY_EXT[ext] || 'application/octet-stream'
    const body = await fs.readFile(filePath)

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: ext === '.m3u8' ? 'public, max-age=60' : 'public, max-age=31536000, immutable',
      }),
    )
    uploaded++
  }

  const baseUrl =
    process.env.CDN_URL?.replace(/\/+$/, '') || `https://${bucket}.s3.${region}.amazonaws.com`
  console.log(`SYNC_MEDIA_TO_S3_COMPLETE uploaded=${uploaded} baseUrl=${baseUrl}/media`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
