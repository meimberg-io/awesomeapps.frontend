import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 mt-6">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3 mt-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-medium mb-2 mt-2">{children}</h3>,
                p: ({ children }) => <p className="text-base leading-relaxed mb-4">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2">{children}</ol>,
                li: ({ children }) => <li className="ml-4">{children}</li>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                        {children}
                    </blockquote>
                ),
                code: ({ className, children }) => {
                    return className ? (
                        <code className="bg-gray-900 text-white p-2 rounded-md block overflow-x-auto">
                            {children}
                        </code>
                    ) : (
                        <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded">
                            {children}
                        </code>
                    );
                },
                pre: ({ children }) => (
                    <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
            {children}
          </pre>
                ),
                a: ({ href, children }) => {
                    return (
                        <a
                            href={href as string}
                            className="text-blue-500 font-semibold hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    );
                },
                strong: ({ children }) => (
                    <strong className="font-bold text-black">{children}</strong>
                ),
                em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                hr: () => <hr className="border-t-2 border-gray-300 my-6" />,
                table: ({ children }) => (
                    <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                        {children}
                    </table>
                ),
                thead: ({ children }) => <thead className="bg-gray-100 font-semibold">{children}</thead>,
                tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
                tr: ({ children }) => <tr className="border-b">{children}</tr>,
                th: ({ children }) => (
                    <th className="px-4 py-2 border border-gray-300 text-gray-700">{children}</th>
                ),
                td: ({ children }) => (
                    <td className="px-4 py-2 border border-gray-300">{children}</td>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
