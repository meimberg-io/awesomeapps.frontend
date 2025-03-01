'use client'

import React, {useEffect, useState} from "react";
import {Service, Tag} from "../types";
import {fetchServices, fetchTags} from "../api/services.ts";
import ServiceList from "../components/ServiceList.tsx";
import Header from "../components/Header.tsx";
import TagsSelected from "../components/TagsSelected.tsx";
import TagsAvailable from "../components/TagsAvailable.tsx";

const MainPage: React.FC = () => {

    const [services, setServices] = useState<Service[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

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
                    <TagsAvailable tags={tags} selectedTags={selectedTags} toggleTag={toggleTag}/>
                    {selectedTags.length > 0 && <TagsSelected selectedTags={selectedTags} toggleTag={toggleTag}/>
                    }
                    <ServiceList services={services} selectedTags={selectedTags} toggleTag={toggleTag}/>
                </div>
            </main>
        </div>
    )
}

export default MainPage;