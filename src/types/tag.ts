export type TagStatus = 'active' | 'proposed' | 'excluded'

export interface Tag {
  documentId: string;
  name: string;
  count?: number;
  description?: string;
  icon?: string;
  tagStatus?: TagStatus;
  excluded?: boolean;
}
