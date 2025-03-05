

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