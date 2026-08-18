import {createClient} from '@sanity/client'

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'srzlbos7'
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-18'

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
})
