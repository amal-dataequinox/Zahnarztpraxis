import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { seedJobsPortalData } from './jobsSeedData'

async function run() {
  const payload = await getPayload({ config })
  await seedJobsPortalData(payload, { updateJobsPageLayout: true })
  console.log('SEED_JOBS_PORTAL_COMPLETE')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
