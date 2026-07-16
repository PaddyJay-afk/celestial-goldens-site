import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seed } from './seed'

const run = async () => {
  const payload = await getPayload({ config })
  await seed(payload)
  process.exit(0)
}

run().catch((err) => {
   
  console.error('[seed] failed:', err)
  process.exit(1)
})
