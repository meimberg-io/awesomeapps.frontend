export interface NewService {
  documentId: string;
  slug: string;
  n8nstatus: 'new' | 'pending' | 'finished' | 'error';
  createdAt: string;
  updatedAt: string;
}

