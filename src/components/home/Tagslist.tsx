import React from "react";
import {Tag} from "@/types/tag";

import Link from "next/link";
import {renderIcon} from "@/components/util/renderIcon";

export interface TagsAvailableProps {
    tags: Tag[];

}


const TagsAvailable: React.FC<TagsAvailableProps> = ({tags}) => {
    return (
        <header className="pt-6 pb-4 sm:pb-6 bg-gray-600">
            <div className="max-w-screen-2xl px-4 sm:px-6 lg:px-8 mx-auto ">
                <div className=" grid grid-cols-2 md:grid-cols-4 gap-4">

                    {tags.map((tag: Tag) => (
                        <Link href={`/t/${tag.name}`} key={tag.documentId}
                              className="transition-all group h-auto max-w-full rounded-lg bg-sasecondary-950 text-sasecondary-100 border-0 hover:brightness-125 hover:no-underline"
                        >

                            <div key={tag.documentId} className="flex relative">

                                {tag.icon && (
                                    <div className="p-4">
                                        {renderIcon(tag.icon, ' flex-col text-saprimary-200 mr-1', 36)}
                                    </div>
                                )}
                                <div className="p-4 flex-col">
                                    <p className="text-xl text-white">{tag.name}</p>
                                    <p className="text-sm">{tag.description}</p>
                                </div>
                                <div
                                    className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-white text-saprimary-400  rounded-full bottom-2 end-2 border-gray-900">
                                    {tag.count}
                                </div>

                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    )
}
export default TagsAvailable;
