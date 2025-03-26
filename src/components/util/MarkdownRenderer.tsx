"use client"
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string | undefined;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({content}) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({children}) => <h1>{children}</h1>,
                h2: ({children}) => <h2>{children}</h2>,
                h3: ({children}) => <h3>{children}</h3>,
                p: ({children}) => <p>{children}</p>,
                ul: ({children}) => <ul>{children}</ul>,
                ol: ({children}) => <ol>{children}</ol>,
                li: ({children}) => <li>{children}</li>,
                blockquote: ({children}) => (
                    <blockquote >
                        {children}
                    </blockquote>
                ),
                code: ({className, children}) => {
                    return className ? (
                        <code className="bg-gray-900 text-white p-2 rounded-md block overflow-x-auto">{children}</code>
                    ) : (
                        <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded">{children}</code>
                    );
                },
                pre: ({children}) => (
                    <pre>{children}</pre>
                ),
                a: ({href, children}) => {
                    return (
                        <a href={href as string} target="_blank" rel="noopener noreferrer">{children}</a>
                    );
                },
                strong: ({children}) => (
                    <strong>{children}</strong>
                ),
                em: ({children}) => <em>{children}</em>,
                hr: () => <hr className="border-t-2 border-gray-300 my-6"/>,
                table: ({children}) => <table>{children}</table>,
                thead: ({children}) => <thead>{children}</thead>,
                tbody: ({children}) => <tbody>{children}</tbody>,
                tr: ({children}) => <tr>{children}</tr>,
                th: ({children}) => <th>{children}</th>,
                td: ({children}) => <td>{children}</td>
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
