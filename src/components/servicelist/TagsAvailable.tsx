

import React from "react";
import {Tag} from "@/types/tag";

type IconNodeEntry = [tag: string, attrs: Record<string, string>];

type IconNodeMap = Record<string, IconNodeEntry[]>;


import icons from 'lucide-static/icon-nodes.json';

export interface TagsAvailableProps {
    tags: Tag[];
    selectedTags: Tag[];
    toggleTag: (tag: string) => void;
}


export function renderIcon(name: string, className?: string, size: number = 16) {
    const node = (icons as unknown as IconNodeMap)[name];
    if (!node) {
        console.warn(`⚠️ Icon "${name}" nicht gefunden`);
        return null;
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={{
                verticalAlign: 'middle',
                display: 'inline-block',
            }}
        >
            {node.map(([tag, attrs], i) => {
                const Tag = tag as keyof JSX.IntrinsicElements;
                return <Tag key={i} {...attrs} />;
            })}
        </svg>
    );
}



const TagsAvailable: React.FC<TagsAvailableProps> = ({tags, selectedTags, toggleTag}) => {
    console.log('Rendering TagsAvailable', typeof window === 'undefined' ? 'on server' : 'on client');

    return (
        <header className="pt-6 pb-4 sm:pb-6 bg-gray-600">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 sm:px-6 lg:px-8 text-md">
                {tags.filter(tag => !selectedTags.some(selectedTag => selectedTag.documentId === tag.documentId)).map((tag: Tag) => (
                    <button  key={tag.documentId}
                             className="btn btn-sm bg-sasecondary-950 text-sasecondary-100 border-0 hover:bg-saprimary-200 hover:text-saprimary-950"
                             onClick={() => toggleTag(tag.documentId)}>
                        {
                            tag.icon && renderIcon(tag.icon, 'text-saprimary-200 mr-1', 16)

                            // @ts-ignore
                            // tag.icon &&     <Icon
                            //     icon={"lucide-" + tag.icon}
                            //     width={16}
                            //     height={16}
                            //     className="text-saprimary-200 mr-1"
                            // />
                            // <DynamicIcon name={tag.icon} size={16} className="text-saprimary-200" />



                        }
                        <span className="text-base">
                        {tag.name}
                        <div
                            className="badge ml-2 badge-sm bg-sasecondary-100 text-sasecondary-900 border-0 group-hover:bg-saprimary-50 group-hover:text-saprimary-950" >
                            {tag.count}
                        </div>
                            </span>
                    </button>
                ))}
            </div>
        </header>
    )
}
export default TagsAvailable;
