import React from 'react'

import { ApplicationGuide } from '@/components/jobs/ApplicationGuide'
import { JobsBoardClient, type JobBoardItem } from '@/components/jobs/JobsBoardClient'
import type { JobsOverviewBlock } from '@/payload-types'
import { getActiveJobs, getJobBoardConfig } from '@/utilities/cmsQueries'

export async function JobsOverviewBlockView({ block }: { block: JobsOverviewBlock }) {
  const [jobs, boardConfig] = await Promise.all([
    getActiveJobs().catch(() => []),
    getJobBoardConfig().catch(() => null),
  ])

  const items: JobBoardItem[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    slug: job.slug,
    jobId: job.jobId,
    department: job.department,
    location: job.location,
    workload: job.workload,
    employmentType: job.employmentType,
    summary: job.summary,
    startDate: job.startDate,
  }))

  return (
    <>
      <JobsBoardClient
        initialJobs={items}
        eyebrow={block.eyebrow || boardConfig?.eyebrow || 'Offene Stellen'}
        heading={block.heading || boardConfig?.title || 'Aktuelle'}
        headingHighlight={block.headingHighlight || 'Stellenangebote.'}
        intro={
          block.intro ||
          boardConfig?.description ||
          'Verstärken Sie unser engagiertes Praxisteam in Appenzell und Gais.'
        }
        showFilters={block.showFilters !== false}
        emptyHeading={block.emptyHeading}
        emptyDescription={block.emptyDescription}
      />
      {block.showApplicationGuide !== false ? (
        <ApplicationGuide data={boardConfig?.applicationGuide} />
      ) : null}
    </>
  )
}
