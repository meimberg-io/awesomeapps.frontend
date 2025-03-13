import React from "react";

import Header from "../../components/Header";
import {GetServerSideProps} from "next";
import {fetchServiceDetailBySlug} from "../../api/services";
import {Service} from "../../types/service";
import ServiceDetail from "../../components/servicedetail/ServiceDetail";
import PageHeader, {PageHeaderStyle} from "../../components/PageHeader";
import {ArrowRightCircleIcon} from "@heroicons/react/20/solid";
import Link from "next/link";

interface DetailPageProps {
    service: Service | null;
}

const DetailPage: React.FC<DetailPageProps> = ({service}) => {
    if (!service) {
        return <p>Service nicht gefunden</p>; // Fehlerhandling für ungültige IDs
    }

    return (


        <>
            <Header/>

            <div className="relative isolate overflow-hidden pt-16 mb-16 mx-auto">
                <div className="shadow-lg">
                    <PageHeader title={service.name} subtitle={service.abstract} icon={service.logo} style={PageHeaderStyle.SERVICE}/>
                </div>
            </div>


            <div className="grid grid-cols-3 gap-x-2 gap-y-16 lg:mx-auto max-w-7xl  lg:mx-0 lg:grid-cols-2 lg:items-start lg:gap-y-10  ">

                <div className="col-span-2 lg:gap-x-2 lg:pr-8">

                    {/* service detail */}

                    <ServiceDetail service={service}/>

                </div>

                <div className="lg:sticky w-96 lg:top-12 pt-8 lg:col-start-3  rotate-3 lg:overflow-hidden ">

                    {/* meta card */}

                    <div className="mb-16 px-4 pb-12 max-w-full">
                        <div className="card bg-sasecondary-50 shadow-xl overflow-hidden">
                            <div className="card-body">
                                <h3 className="mt-0 text-sasecondary-600">{service.name}</h3>
                                <p className="text-md mt-1 text-blue-700 mb-0">{service.shortfacts}</p>
                            </div>
                            <Link className="card-actions bg-sasecondary-400 hover:bg-saprimary-500 p-5 hover:no-underline" href={service.url} target="_blank">
                                <ArrowRightCircleIcon aria-hidden="true" className="size-6 text-sasecondary-50 hover:text-saprimary-50"/>
                                <span className="text-white hover:text-saprimary-50">{service.url}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>


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
