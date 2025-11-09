import type { Tag, TagStatus } from '@/types/tag'

export const resolveTagStatus = (tag: Tag): TagStatus => {
  if (tag.tagStatus) {
    return tag.tagStatus
  }
  return tag.excluded ? 'excluded' : 'active'
}

export const isTagActive = (tag: Tag): boolean => resolveTagStatus(tag) === 'active'

export const isTagProposed = (tag: Tag): boolean => resolveTagStatus(tag) === 'proposed'

export const isTagExcluded = (tag: Tag): boolean => resolveTagStatus(tag) === 'excluded'

