import React from "react";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
// @ts-ignore
// @ts-ignore
import {RootNode, BlocksComponents as DefaultBlocksComponents, BlockRendererProps} from "@strapi/blocks-react-renderer/dist/BlocksRenderer";


type RichTextProps = {
    content: RootNode[];
};

const RichTextBlocks: React.FC<RichTextProps> = ({content}) => {
    if (!content || !Array.isArray(content)) {
        return null;
    }

    return (
        <BlocksRenderer
            content={content}
            blocks={{
                // Du kannst die Standardkomponenten verwenden, um Klassenamen zu setzen...
                paragraph: ({children}) => <p className="text-neutral-900 mb-2">{children}</p>,
                // ...oder auf ein Designsystem verweisen
                heading: ({children, level}) => {
                    switch (level) {
                        case 1:
                            return <h1 className="text-4xl font-bold mb-8 mt-6">{children}</h1>
                        case 2:
                            return <h2 className="text-3xl font-semibold mb-8 mt-5">{children}</h2>
                        case 3:
                            return <h3 className="text-xl font-medium mb-4 mt-8">{children}</h3>
                        case 4:
                            return <h4 className="text-lg font-medium mb-2 mt-2">{children}</h4>
                        case 5:
                            return <h5 className="text-lg font-medium mb-2 mt-2">{children}</h5>
                        case 6:
                            return <h6 className="text-lg font-medium mb-2 mt-2">{children}</h6>
                        default:
                            return <h1 className="text-4xl font-bold">{children}</h1>
                    }
                },
                // Für Links kannst du die Komponente deines Routers oder Frameworks verwenden
                link: ({children, url}) => <a href={url} className="text-blue-500 hover:underline">{children}</a>,
                list: ({children, format}) => {
                    const baseClasses = "my-3 pl-4";
                    if (format === "ordered") {
                        return (
                            <ol className={`list-decimal list-inside ${baseClasses}`}>{children}</ol>
                        );
                    } else {
                        return (
                            <ul className={`list-disc list-inside ${baseClasses}`}>{children}</ul>
                        );
                    }
                },
            }}
            modifiers={{
                bold: ({children}) => <strong className="font-bold">{children}</strong>,
                italic: ({children}) => <span className="italic">{children}</span>,
            }}
        />
    );
};

export default RichTextBlocks;
