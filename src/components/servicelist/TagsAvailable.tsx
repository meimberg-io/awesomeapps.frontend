'use client'

import React from "react";
import {Tag} from "@/types/tag";
import {DynamicIcon} from "lucide-react/dynamic";

export interface TagsAvailableProps {
    tags: Tag[];
    selectedTags: Tag[];
    toggleTag: (tag: string) => void;
}

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

const TagsAvailable: React.FC<TagsAvailableProps> = ({tags, selectedTags, toggleTag}) => {

    return (
        <header className="pt-6 pb-4 sm:pb-6 bg-gray-600">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 sm:px-6 lg:px-8 text-md">
                {tags.filter(tag => !selectedTags.some(selectedTag => selectedTag.documentId === tag.documentId)).map((tag: Tag) => (
                    <button  key={tag.documentId}
                             className="btn btn-sm bg-sasecondary-950 text-sasecondary-100 border-0 hover:bg-saprimary-200 hover:text-saprimary-950"
                             onClick={() => toggleTag(tag.documentId)}>
                        {
                            // @ts-ignore
                            tag.icon && <DynamicIcon name={tag.icon} size={16} className="text-saprimary-200" />
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
