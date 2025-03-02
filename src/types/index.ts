// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {RootNode} from "@strapi/blocks-react-renderer/dist/BlocksRenderer";

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
    url: string;

    description: string | null;
    longdesc: RootNode[];

    thumbnail: Image;
    logo: Image;
    tags: Tag[];
}
