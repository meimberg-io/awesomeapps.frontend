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
                h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-semibold mt-5 mb-2 text-foreground">{children}</h3>,
                p: ({children}) => <p className="text-base text-muted-foreground leading-relaxed mb-4">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside space-y-2 mb-4 ml-4 text-muted-foreground marker:text-primary">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-muted-foreground marker:text-primary">{children}</ol>,
                li: ({children}) => <li className="text-base leading-relaxed">{children}</li>,
                blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r">
                        {children}
                    </blockquote>
                ),
                code: ({className, children}) => {
                    return className ? (
                        <code className="bg-gray-900 text-white p-4 rounded-lg block overflow-x-auto my-4 text-sm">{children}</code>
                    ) : (
                        <code className="bg-muted text-primary px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                    );
                },
                pre: ({children}) => (
                    <pre className="bg-gray-900 rounded-lg overflow-hidden my-4">{children}</pre>
                ),
                a: ({href, children}) => {
                    return (
                        <a href={href as string} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{children}</a>
                    );
                },
                strong: ({children}) => (
                    <strong className="font-bold text-foreground">{children}</strong>
                ),
                em: ({children}) => <em className="italic">{children}</em>,
                hr: () => <hr className="border-t border-border my-8"/>,
                table: ({children}) => <table className="w-full border-collapse border border-border rounded-lg overflow-hidden my-6">{children}</table>,
                thead: ({children}) => <thead className="bg-muted">{children}</thead>,
                tbody: ({children}) => <tbody className="divide-y divide-border">{children}</tbody>,
                tr: ({children}) => <tr className="hover:bg-muted/50 transition-colors">{children}</tr>,
                th: ({children}) => <th className="px-4 py-3 text-left font-semibold text-foreground border border-border">{children}</th>,
                td: ({children}) => <td className="px-4 py-3 text-muted-foreground border border-border">{children}</td>
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
