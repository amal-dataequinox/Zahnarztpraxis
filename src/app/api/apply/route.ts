import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@payload-config'

const MAX_RESUME_BYTES = 2 * 1024 * 1024

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const ALLOWED_EXTENSIONS = /\.(pdf|doc|docx)$/i

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const jobId = formData.get('jobId')?.toString().trim()
    const fullName = formData.get('fullName')?.toString().trim()
    const email = formData.get('email')?.toString().trim()
    const phone = formData.get('phone')?.toString().trim()
    const address = formData.get('address')?.toString().trim()
    const linkedin = formData.get('linkedin')?.toString().trim() || undefined
    const hasPortfolio = formData.get('hasPortfolio') === 'true'
    const additionalComments = formData.get('additionalComments')?.toString().trim() || undefined
    const resumeFile = formData.get('resume') as File | null

    if (!jobId || !fullName || !email || !phone || !address || !resumeFile) {
      return NextResponse.json(
        { error: 'Bitte füllen Sie alle Pflichtfelder aus und laden Sie Ihren Lebenslauf hoch.' },
        { status: 400 },
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
        { status: 400 },
      )
    }

    if (resumeFile.size <= 0 || resumeFile.size > MAX_RESUME_BYTES) {
      return NextResponse.json(
        { error: 'Die Datei darf maximal 2 MB gross sein.' },
        { status: 400 },
      )
    }

    const mimeAllowed = !resumeFile.type || ALLOWED_MIME_TYPES.has(resumeFile.type)
    const extAllowed = ALLOWED_EXTENSIONS.test(resumeFile.name)
    if (!mimeAllowed || !extAllowed) {
      return NextResponse.json(
        { error: 'Ungültiges Dateiformat. Erlaubt sind nur PDF, DOC oder DOCX.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    const jobsRes = await payload.find({
      collection: 'jobs',
      limit: 1,
      where: {
        and: [{ jobId: { equals: jobId } }, { status: { equals: 'active' } }],
      },
    })

    const job = jobsRes.docs[0]
    if (!job) {
      return NextResponse.json(
        { error: 'Diese Stelle ist nicht mehr aktiv oder wurde nicht gefunden.' },
        { status: 404 },
      )
    }

    const arrayBuffer = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fallbackMime =
      resumeFile.type && ALLOWED_MIME_TYPES.has(resumeFile.type)
        ? resumeFile.type
        : resumeFile.name.toLowerCase().endsWith('.docx')
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : resumeFile.name.toLowerCase().endsWith('.doc')
            ? 'application/msword'
            : 'application/pdf'

    const uploadedResume = await payload.create({
      collection: 'resumes',
      overrideAccess: true,
      data: {
        alt: `${fullName} - Lebenslauf (${job.jobId})`,
      },
      file: {
        data: buffer,
        name: resumeFile.name,
        mimetype: fallbackMime,
        size: resumeFile.size,
      },
    })

    await payload.create({
      collection: 'job-applications',
      overrideAccess: true,
      data: {
        job: job.id,
        fullName,
        email,
        phone,
        address,
        linkedin,
        hasPortfolio,
        additionalComments,
        resume: uploadedResume.id,
        status: 'new',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing job application:', error)
    return NextResponse.json(
      { error: 'Beim Übermitteln der Bewerbung ist ein Fehler aufgetreten.' },
      { status: 500 },
    )
  }
}
