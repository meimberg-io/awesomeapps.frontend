

// Typ für Tag
export interface Tag {
    id: number;
    documentId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Typ für Service
export interface Service {
    id: number;
    documentId: string;
    name: string;
    description: string | null;
    wutz: string | null;
    url: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    tags: Tag[];
}

// Typ für die gesamte API-Antwort
export interface StrapiResponse<T> {
    data: T[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}
