import React from "react";

import Header from "../../components/Header";
import {GetServerSideProps} from "next";
import {fetchServiceDetailBySlug} from "../../api/services";
import {Service} from "../../types/service";
import ServiceDetail from "../../components/servicedetail/ServiceDetail";
import PageHeader, {PageHeaderStyle} from "../../components/PageHeader";

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
                        <PageHeader title={service.name} subtitle={service.shortdescription} icon={service.logo} style={PageHeaderStyle.SERVICE}/>
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
