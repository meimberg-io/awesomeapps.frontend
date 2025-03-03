// @ts-ignore
import {RootNode} from "@strapi/blocks-react-renderer/dist/BlocksRenderer";

export interface Tag {
    documentId: string;
    name: string;
    count: number;
}

export interface Image {
    url: string;
}

// Service-Typ mit Relation zu Tags
export interface Service {
    documentId: string;
    name: string;
    url: string;
    description: string | null;
    longdesc: RootNode[];
    longdescription: Block[];
    thumbnail: Image;
    logo: Image;
    tags: Tag[];
}

export type Block =
    | { __component: 'shared.rich-text'; props: RichTextBlock }
    | { __component: 'shared.media'; props: MediaBlock }
    | { __component: 'shared.quote'; props: QuoteBlock }
    | { __component: 'shared.slider'; props: SliderBlock };

export interface MediaBlock {
    file: {
        url: string;
        alternativeText: string;
        mime: string;
    };
}

export interface QuoteBlock {
    title: string;
    body: string;
}

export interface RichTextBlock {
    body: string;
}

export interface SliderBlock {
    files: Array<{ url: string; alternativeText: string }>;
}
