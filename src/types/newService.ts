export interface NewService {
  documentId: string;
  slug: string;
  field: string;
  n8nstatus: 'new' | 'pending' | 'finished' | 'error';
  createdAt: string;
  updatedAt: string;
  errorMessage?: string | null;
}


