import { createQueueItem } from '@/lib/api/admin-queue-api'

export type RegenerateField =
  | 'all'
  | 'url'
  | 'description'
  | 'functionality'
  | 'abstract'
  | 'pricing'
  | 'tags'
  | 'video'
  | 'shortfacts'

export async function requestRegeneration(
  jwt: string | undefined,
  serviceName: string,
  field: RegenerateField
): Promise<void> {
  if (!jwt) {
    throw new Error('Missing JWT for regeneration request')
  }

  await createQueueItem(jwt, {
    // existing implementation uses "name" in slug field
    slug: serviceName,
    field: field === 'all' ? '' : field,
    n8nstatus: 'new',
  })
}


