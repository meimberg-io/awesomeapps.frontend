'use client'

import React from "react";
import {Tag} from "../../types/tag";

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
        <header className="pt-6 pb-4 sm:pb-6 bg-blue-300">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:px-6 lg:px-8">
                {tags.filter(tag => !selectedTags.some(selectedTag => selectedTag.documentId === tag.documentId)).map((tag: Tag) => (
                    <button key={tag.documentId} className="btn btn-sm text-blue-950 bg-blue-50 border-0 hover:bg-green-600 hover:text-green-50"
                            onClick={() => toggleTag(tag.documentId)}>
                        {tag.name}
                        <div className="badge badge-sm bg-white text-blue-300">{tag.count}</div>
                    </button>
                ))}
            </div>
        </header>
    )
}
export default TagsAvailable;
