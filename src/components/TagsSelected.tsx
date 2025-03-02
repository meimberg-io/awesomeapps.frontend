'use client'

import {Tag} from "../types";
import React from "react";

export interface TagsSelectedProps {
    selectedTags: Tag[],
    toggleTag: (tag: Tag) => void,

}

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

const TagsSelected: React.FC<TagsSelectedProps> = ({selectedTags, toggleTag}) => {
    return (

        <header className="pt-6 pb-4 sm:pb-6 bg-blue-50 ">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">

            <h1 className="text-base/7 font-semibold text-blue-950">Selected Categories</h1>
                {selectedTags.map((tag: Tag) => (
                    <button key={tag.id} className="btn btn-sm text-blue-50 bg-blue-800 border-0 hover:bg-red-700 hover:text-red-50" onClick={() => toggleTag(tag)}>
                        {tag.name}
                    </button>
                ))}
            </div>
        </header>
    )
}
export default TagsSelected;