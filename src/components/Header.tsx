import React from "react";

const Header: React.FC  = () => {
    return (

        <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 items-center gap-x-6">
                    <button type="button" className="-m-3 p-3 md:hidden">
                        <span className="sr-only">Open main menu</span>
                        <svg className="size-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                            <path fill-rule="evenodd"
                                  d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                                  clip-rule="evenodd"/>
                        </svg>
                    </button>
                        <img className="h-8 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
                </div>
                <nav className="hidden md:flex md:gap-x-11 md:text-sm/6 md:font-semibold md:text-gray-700">
                    <a href="#">Home</a>
                    <a href="#">Invoices</a>
                    <a href="#">Clients</a>
                    <a href="#">Expenses</a>
                </nav>
                <div className="flex flex-1 items-center justify-end gap-x-8">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">View notifications</span>
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                    </button>
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your profile</span>

                        <img className="size-8 rounded-full bg-gray-800" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    </a>
                </div>
            </div>
            <div className="lg:hidden" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50"></div>
                <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
                    <div className="-ml-0.5 flex h-16 items-center gap-x-6">
                        <button type="button" className="-m-2.5 p-2.5 text-gray-700">
                            <span className="sr-only">Close menu</span>
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="-ml-0.5">
                            <a href="#" className="-m-1.5 block p-1.5">
                                <span className="sr-only">Your Company</span>
                                <figure>
                                    <img className="h-8 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                                </figure>
                            </a>
                        </div>
                    </div>
                    <div className="mt-2 space-y-2">
                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Home</a>
                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Invoices</a>
                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Clients</a>
                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Expenses</a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
