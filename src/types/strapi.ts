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

export const ComponentTypes = {
    RichText: 'ComponentSharedRichText',
    Media: 'ComponentSharedMedia',
    Quote: 'ComponentSharedQuote',
    Slider: 'ComponentSharedSlider',
} as const;

export type Block =
    | { __typename: typeof ComponentTypes.RichText}
    | { __typename: typeof ComponentTypes.Media }
    | { __typename: typeof ComponentTypes.Quote }
    | { __typename: typeof ComponentTypes.Slider };

export type BlockProps<T> = T extends { props: infer P } ? P : never;


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
