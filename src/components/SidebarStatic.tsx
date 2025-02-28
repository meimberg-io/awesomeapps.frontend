import {Cog6ToothIcon} from "@heroicons/react/24/outline";
import React from "react";
import {classNames, SidebarProps} from "./Sidebar.tsx";


const SidebarStatic: React.FC<SidebarProps> = ({navigation, tags, selectedTags, toggleTag}) => {

    return (

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                    <img
                        alt="Your Company"
                        src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                        className="h-8 w-auto"
                    />
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">

                        <li>
                            <div className="text-xs/6 font-semibold text-gray-400">Your teams</div>
                            <ul className="-mx-2 mt-2 space-y-1">
                                {tags.map((tag) => (
                                    <li key={tag.name}>
                                        <a
                                            href="#"
                                            onClick={() => toggleTag(tag)}
                                            className={classNames(
                                                selectedTags.some(t => t.id === tag.id)
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                                            )}
                                        >
                                                <span
                                                    className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                                    {tag.count}
                                                </span>
                                            <span className="truncate">{tag.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li>
                            <ul className="-mx-2 space-y-1">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                            )}
                                        >
                                            <item.icon aria-hidden="true" className="size-6 shrink-0"/>
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="mt-auto">
                            <a
                                href="#"
                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                                <Cog6ToothIcon aria-hidden="true" className="size-6 shrink-0"/>
                                Settings
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

    );

}

export default SidebarStatic;