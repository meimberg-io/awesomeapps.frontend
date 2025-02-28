'use client'

import {
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';

import Sidebar from "../components/Sidebar.tsx";
import {NavItem} from "../components/Sidebar.tsx";
import Header from "../components/Header.tsx";
import  {useEffect, useState} from "react";
import {Service, Tag} from "../types";
import {fetchServices, fetchTags} from "../api/services.ts";
import ServiceList from "../components/ServiceList.tsx";



const navigation : NavItem[] = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Team', href: '#', icon: UsersIcon, current: false },
    { name: 'Projects', href: '#', icon: FolderIcon, current: false },
    { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
    { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
    { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]




export default function Example() {
    const [services, setServices] = useState<Service[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const toggleTag = (tag: Tag) => {
        setSelectedTags(prevTags =>
            prevTags.some(t => t.id === tag.id)
                ? prevTags.filter(t => t.id !== tag.id)
                : [...prevTags, tag]
        );
    };

    useEffect(() => {
        fetchServices(selectedTags ?? []).then(setServices).catch(console.error);
        fetchTags(selectedTags ?? []).then(setTags).catch(console.error);
    }, [selectedTags]);





    return (
        <>

            <div>


                {/* Static sidebar for desktop */}

                <Sidebar navigation={navigation} tags={tags} selectedTags={selectedTags} toggleTag={toggleTag}  />

                <div className="lg:pl-72">
                    <Header></Header>

                    <main className="py-10 w-full ">
                        <div className="px-4 sm:px-6 lg:px-8 w-full ">

                            <ServiceList services={services} selectedTags={selectedTags} toggleTag={toggleTag} />
                            {/* Your content */}</div>
                    </main>
                </div>
            </div>
        </>
    )
}