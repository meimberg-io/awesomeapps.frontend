'use client'

import React, {useEffect} from "react";
import {Service, Tag} from "../types";
import {fetchServices, fetchTags} from "../api/services.ts";
import ServiceList from "../components/ServiceList.tsx";
import Header from "../components/Header.tsx";
import TagsSelected from "../components/TagsSelected.tsx";
import TagsAvailable from "../components/TagsAvailable.tsx";

interface MainPageProps {
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    selectedTags: Tag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const MainPage: React.FC<MainPageProps> = ({services, setServices, tags, setTags, selectedTags, setSelectedTags }: MainPageProps) => {


    const toggleTag = (tag: Tag) => {
        console.log("SEL1", tag.selected);
        tag.selected = !tag.selected;
        console.log("SEL2", tag.selected);
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
        <div>
            <Header/>
            <main>
                <div className="relative isolate overflow-hidden pt-16">
                    <div className="shadow-lg">
                        <TagsAvailable tags={tags} selectedTags={selectedTags} toggleTag={toggleTag}/>
                        {selectedTags.length > 0 && <TagsSelected selectedTags={selectedTags} toggleTag={toggleTag}/>
                        }
                    </div>
                    <ServiceList services={services} selectedTags={selectedTags} toggleTag={toggleTag}/>
                </div>
            </main>
        </div>
    )
}

export default MainPage;