import {Dialog, DialogBackdrop, DialogPanel, TransitionChild} from "@headlessui/react";
import {Cog6ToothIcon, XMarkIcon} from "@heroicons/react/24/outline";
import React, {useState} from "react";
import {classNames, SidebarProps} from "./Sidebar.tsx";


const SidebarMobile: React.FC<SidebarProps> = ({ navigation, tags , selectedTags, toggleTag}) => {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (



        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            />

            <div className="fixed inset-0 flex">
                <DialogPanel
                    transition
                    className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                >
                    <TransitionChild>
                        <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                            <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                <span className="sr-only">Close sidebar</span>
                                <XMarkIcon aria-hidden="true" className="size-6 text-white"/>
                            </button>
                        </div>
                    </TransitionChild>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
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
                                                    {item.name} xcv
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
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
                                                            X
                                                        </span>
                                                    <span className="truncate">{tag.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <a href="#" className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">
                                        <Cog6ToothIcon aria-hidden="true" className="size-6 shrink-0"/> Settings
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>

        );

}

export default SidebarMobile;