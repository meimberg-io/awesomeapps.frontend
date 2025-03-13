'use client'

import React from "react";
import {Tag} from "../../types/tag";

export interface TagsSelectedProps {
    selectedTags: Tag[],
    toggleTag: (tag: string) => void,

}

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

const TagsSelected: React.FC<TagsSelectedProps> = ({selectedTags, toggleTag}) => {
    return (

        <header className="pt-6 pb-4 sm:pb-6 bg-gray-700 ">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:px-6 lg:px-8">


                {selectedTags.map((tag: Tag) => (
                    <button key={tag.documentId}
                            className="btn btn-sm text-saprimary-950 bg-saprimary-200 border-0 hover:bg-sasecondary-950 hover:text-sasecondary-100 "
                            onClick={() => toggleTag(tag.documentId)}>
                        {tag.name}
                    </button>
                ))}
            </div>
        </header>
    )
}
export default TagsSelected;