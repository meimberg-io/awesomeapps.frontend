// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {RootNode} from "@strapi/blocks-react-renderer/dist/BlocksRenderer";

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
    url: string;
    description: string | null;
    longdesc: RootNode[];
    thumbnail: StrapiImage;
    logo: StrapiImage;
    tags: StrapiTag[];
}
