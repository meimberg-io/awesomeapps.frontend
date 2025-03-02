import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {fetchServiceDetail} from "../api/services";
import {Service} from "../types";
import Header from "../components/Header.tsx";

import {BASE_URL} from "../App.tsx";
import RichText from "../components/RichText.tsx";
import {ArrowRightCircleIcon, LinkIcon} from "@heroicons/react/20/solid";

const DetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>(); // ID aus der URL holen
    const [service, setService] = useState<Service | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchServiceDetail(id)
            .then(setService)
            .catch(() => setError("Service konnte nicht geladen werden"));
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!service) return <p>Laden...</p>;

    return (

        <div>
            <Header/>
            <main>

                <div className="relative isolate overflow-hidden pt-16">
                    <div className="shadow-lg">

                        <header className="pt-6 pb-4 sm:pb-6 bg-blue-50 ">
                            <div className="mx-auto flex max-w-7xl flex-row items-stretch gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 justify-between">
                                <div className="a1">
                                    <h1 className="text-xl font-semibold text-blue-950">{service.name}</h1>
                                    <p className="mt-3">{service.description}</p>
                                </div>
                                <figure className="w-20 h-20 rounded-full bg-white flex items-center justify-center ">
                                    <img src={service.logo ? BASE_URL + service.logo.url : ''} alt={service.name} className="max-h-10 max-w-10 "/>
                                </figure>
                            </div>
                        </header>


                        <div className="pt-6 pb-4 sm:pb-6 max-w-7xl gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8  mx-auto">
                            <RichText content={service.longdesc}/>


                            <div role="alert" className="alert my-6 bg-green-100 border-0 text-green-800 font-bold shadow-sm">
                                <ArrowRightCircleIcon aria-hidden="true" className="size-6 text-green-800"/>
                                <a href={service.url} target="_blank">{service.url}</a>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>


    );
};

export default DetailPage;
