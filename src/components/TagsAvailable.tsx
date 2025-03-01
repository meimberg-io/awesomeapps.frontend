'use client'

import {Tag} from "../types";
import React from "react";

export interface TagsAvailableProps {
    tags: Tag[];
    selectedTags: Tag[];
    toggleTag: (tag: Tag) => void;
}

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

const TagsAvailable: React.FC<TagsAvailableProps> = ({tags, selectedTags, toggleTag}) => {
    return (
        <header className="pt-6 pb-4 sm:pb-6 bg-blue-50">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                {tags.filter(tag => !selectedTags.some(selectedTag => selectedTag.id === tag.id)).map((tag: Tag) => (
                    <button key={tag.id} className="btn btn-sm text-blue-50 bg-blue-800 border-0 hover:bg-green-600 hover:text-green-50" onClick={() => toggleTag(tag)}>
                        {tag.name}
                        <div className="badge badge-sm ">{tag.count}</div>
                    </button>
                ))}
            </div>
        </header>
    )
}
export default TagsAvailable;
