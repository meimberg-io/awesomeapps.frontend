import React from "react";
import {Tag} from "@/types/tag";


import {renderIcon} from "@/components/util/renderIcon";
import Link from "next/link";

export interface TagsAvailableProps {
    tags: Tag[];
    selectedTags: Tag[];
    toggleTag?: (tag: string) => void;

}


const TagsAvailable: React.FC<TagsAvailableProps> = ({tags, selectedTags, toggleTag}) => {
    return (
        <header className="pt-6 pb-4 sm:pb-6 bg-gray-600">
            <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-4 px-4 sm:px-6 lg:px-8 text-md">
                {tags.filter(tag => !tag.excluded && !selectedTags.some(selectedTag => selectedTag.documentId === tag.documentId)).map((tag: Tag) => {
                    const content = (
                        <button key={tag.documentId}
                                className="group btn btn-sm bg-sasecondary-950 text-sasecondary-100 border-0 hover:bg-saprimary-200 hover:text-saprimary-950"
                                onClick={() => toggleTag && toggleTag(tag.documentId)}
                        >
                            {
                                tag.icon && renderIcon(tag.icon, 'text-saprimary-200 mr-1 group-hover:text-saprimary-950', 16)

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
                                        className="badge ml-2 badge-sm bg-sasecondary-100 text-sasecondary-900 border-0 group-hover:bg-saprimary-50 group-hover:text-saprimary-950">
                                        {tag.count}
                                    </div>
                                </span>
                            </button>
                        )

                    return toggleTag ? (
                        content
                    ) : (
                        <Link href={`/t/${tag.name}`} key={tag.documentId}>
                            {content}
                        </Link>
                    );                    }
                )}
            </div>
        </header>
    )
}
export default TagsAvailable;
