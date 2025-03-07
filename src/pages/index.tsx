import React, {useEffect, useState} from "react";
import { GetServerSideProps } from "next";
import { fetchServices, fetchTags } from "../api/services";
import ServiceList from "../components/servicelist/ServiceList";
import Header from "../components/Header";
import TagsSelected from "../components/servicelist/TagsSelected";
import TagsAvailable from "../components/servicelist/TagsAvailable";
import {Service} from "../types/service";
import {Tag} from "../types/tag";

interface MainPageProps {
    initialServices: Service[];
    initialTags: Tag[];
}

const ServicesListPage: React.FC<MainPageProps> = ({ initialServices, initialTags }) => {

    const [services, setServices] = useState<Service[]>(initialServices);
    const [tags, setTags] = useState<Tag[]>(initialTags);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const toggleTag = (tagID: string) => {

        const tag : Tag | undefined = tags.find(t => t.documentId === tagID)

        if (!tag) return;

        setSelectedTags(prevTags =>
            prevTags.some(t => t.documentId === tagID)
                ? prevTags.filter(t => t.documentId !== tagID)
                : [...prevTags, tag]
        );
    };

    useEffect(() => {
        fetchServices(selectedTags).then(setServices).catch(console.error);
        fetchTags(selectedTags).then(setTags).catch(console.error);
    }, [selectedTags]); // Läuft neu, wenn sich `selectedTags` ändert


    return (
        <div>
            <Header />
            <main>
                <div className="relative isolate overflow-hidden pt-16">
                    <div className="shadow-lg">
                        <TagsAvailable tags={tags} selectedTags={selectedTags} toggleTag={toggleTag} />
                        {selectedTags.length > 0 && <TagsSelected selectedTags={selectedTags} toggleTag={toggleTag} />}
                    </div>
                    <ServiceList services={services} selectedTags={selectedTags} toggleTag={toggleTag} />
                </div>
            </main>
        </div>
    );
};

// **SSR für Server-Side Rendering**
export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const initialServices  = await fetchServices([]);
        const initialTags  = await fetchTags([]);
        return { props: { initialServices, initialTags } };
    } catch (error) {
        console.error("Fehler beim Laden der Services:", error);
        return { props: { initialServices: [], initialTags : [] } }; // Fehlerhandling: leere Arrays zurückgeben
    }
};

export default ServicesListPage;
