// Tag-Typ für Filterung
export interface Tag {
    id: string;
    name: string;
    selected: boolean;
    count: number;
}

export interface Image {
    url: string;
}

// Service-Typ mit Relation zu Tags
export interface Service {
    id: string;
    name: string;
    description: string | null;
    thumbnail: Image;
    tags: Tag[];
}
