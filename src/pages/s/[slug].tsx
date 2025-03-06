import React from "react";

import RichText from "../../components/RichText";
import {ArrowRightCircleIcon} from "@heroicons/react/20/solid";
import Header from "../../components/Header";

import {GetServerSideProps} from "next";
import { fetchServiceDetailBySlug} from "../../api/services";
import {STRAPI_BASEURL} from "../_app";
import DynamicZoneComponent from "../../components/dynamiczone/DynamicZoneComponent";
import {Service} from "../../types/service";

interface DetailPageProps {
    service: Service | null;
}

const DetailPage: React.FC<DetailPageProps> = ({ service }) => {
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
                                    <p className="mt-3">{service.description}</p>
                                </div>
                                <figure className="w-20 h-20 rounded-full bg-white flex items-center justify-center ">
                                    <img src={service.logo ? STRAPI_BASEURL + service.logo.url : ''} alt={service.name} className="max-h-10 max-w-10 "/>
                                </figure>
                            </div>
                        </header>


                        <div className="pt-6 pb-4 sm:pb-6 max-w-7xl gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8  mx-auto">
                            <RichText content={service.longdesc}/>

                            {service.longdesc && <DynamicZoneComponent blocks={service.longdescription} />}

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


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };

    console.log("sluggywutz",slug);

    try {



        console.log("aaa1");

        const service  = await fetchServiceDetailBySlug(slug)

        console.log("aaa2",service);
        return { props: { service } };
    } catch (error) {
        console.log("aaa3",error);
        return { props: { service: null } };
    }
};
export default DetailPage;
