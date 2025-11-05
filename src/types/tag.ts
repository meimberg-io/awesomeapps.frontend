export interface Tag {
    documentId: string;
    name: string;
    count: number;
    description?: string;
    icon?: string;
    excluded?: boolean;
}
