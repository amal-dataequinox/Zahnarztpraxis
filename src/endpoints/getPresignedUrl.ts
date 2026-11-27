import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { PayloadHandler } from 'payload'

/**
 * Generates an authenticated presigned PUT URL so HLS segments and large assets
 * can be uploaded straight from Payload Admin to S3/R2 (bypassing Vercel's 4.5 MB
 * serverless request body limit). Returns HTTP 501 when S3_BUCKET is unset so
 * local development falls back seamlessly to /api/hls-upload.
 */
export const getPresignedUrlHandler: PayloadHandler = async (req) => {
  try {
    if (!req.user) {
      return Response.json({ error: 'Nicht autorisiert.' }, { status: 401 })
    }

    const bucket = process.env.S3_BUCKET?.trim()
    if (!bucket) {
      return Response.json(
        { error: 'S3_BUCKET ist nicht konfiguriert.', mode: 'local' },
        { status: 501 },
      )
    }

    const request = req as unknown as Request
    const body = (await request.json().catch(() => null)) as {
      key?: unknown
      contentType?: unknown
    } | null
    const rawKey = typeof body?.key === 'string' ? body.key.trim().replace(/^\/+/, '') : ''
    const contentType = typeof body?.contentType === 'string' ? body.contentType.trim() : ''

    if (!rawKey || !contentType || rawKey.includes('..') || rawKey.includes('\\')) {
      return Response.json({ error: 'Ungültiger Schlüssel oder Content-Type.' }, { status: 400 })
    }

    const region = process.env.S3_REGION || 'eu-central-2'
    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT } : {}),
    })

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: rawKey,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    const baseUrl =
      process.env.CDN_URL?.replace(/\/+$/, '') || `https://${bucket}.s3.${region}.amazonaws.com`

    return Response.json({ url, baseUrl, mode: 's3' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Presigned URL fehlgeschlagen.'
    return Response.json({ error: message }, { status: 500 })
  }
}
