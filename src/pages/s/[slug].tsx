import React from "react";

import Header from "../../components/Header";
import {GetServerSideProps} from "next";
import {fetchServiceDetailBySlug} from "../../api/services";
import {STRAPI_BASEURL} from "../_app";
import {Service} from "../../types/service";
import ServiceDetail from "../../components/servicedetail/ServiceDetail";

interface DetailPageProps {
    service: Service | null;
}

const DetailPage: React.FC<DetailPageProps> = ({service}) => {
    if (!service) {
        return <p>Service nicht gefunden</p>; // Fehlerhandling für ungültige IDs
    }

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
                                    <p className="mt-3">{service.shortdescription}</p>
                                </div>
                                <figure className="w-20 h-20 rounded-full bg-white flex items-center justify-center ">
                                    <img src={service.logo ? STRAPI_BASEURL + service.logo.url : ''} alt={service.name} className="max-h-10 max-w-10 "/>
                                </figure>
                            </div>
                        </header>

                        <ServiceDetail service={service}/>

                    </div>

                </div>
            </main>
        </div>
    );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {slug} = context.params as { slug: string };
    try {
        const service = await fetchServiceDetailBySlug(slug)
        return {props: {service}};
    } catch (error) {
        return {props: {service: null}};
    }
};

export default DetailPage;
