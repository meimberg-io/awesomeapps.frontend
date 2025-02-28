// Tag-Typ für Filterung
export interface StrapiTag {
    documentId: string;
    name: string;
    count: number;
}

export interface StrapiImage {
    url: string;
}

// Service-Typ mit Relation zu Tags
export interface StrapiService {
    documentId: string;
    name: string;
    description: string | null;
    thumbnail: StrapiImage[];
    tags: StrapiTag[];
}
