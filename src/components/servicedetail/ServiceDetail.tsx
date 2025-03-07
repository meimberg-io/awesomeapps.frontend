import React from "react";
import {Service} from "../../types/service";
import RichTextBlocks from "../strapicomponents/richtextblocks/RichTextBlocks";
import DynamicZoneComponent from "../strapicomponents/dynamiczone/DynamicZoneComponent";
import {ArrowRightCircleIcon} from "@heroicons/react/20/solid";
import MarkdownRenderer from "../util/MarkdownRenderer";

interface Props {
    service: Service;
}

const ServiceDetail: React.FC<Props> = ({service}) => {
    return (

        <div className="pt-6 pb-4 sm:pb-6 max-w-7xl gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 mx-auto">

            {/* longdescription */}

            <div className="mb-16">
                <RichTextBlocks content={service.longdescription}/>
            </div>

            {/* longdescription */}


            {service.pricing && (
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 mt-5">Pricing</h2>
                    <MarkdownRenderer content={service.pricing}/>

                </div>
            )}

            {/* articlecontent */}


            <div className="mb-16">
                {service.articlecontent && <DynamicZoneComponent blocks={service.articlecontent}/>}
            </div>

            {/* url */}

            <div className="mb-16">
                <h2 className="text-3xl font-semibold mb-8 mt-5">URL</h2>

                <div role="alert" className="alert my-6 bg-green-100 border-0 text-green-800 font-bold shadow-sm">
                    <ArrowRightCircleIcon aria-hidden="true" className="size-6 text-green-800"/>
                    <a href={service.url} target="_blank">{service.url}</a>
                </div>
            </div>

            {/* disclaimer */}

            {service.pricing && (
                <div className="mb-16">

                    <p className="mt-2 text-sm text-right italic text-gray-400 ">Die Preise können je nach Region variieren. Wir übernehmen keine Gewähr auf die Korrektheit der
                        Preise. Für aktuelle Informationen siehe: <a href={service.url}>{service.url}</a></p>
                </div>
            )}

        </div>
    );
};

export default ServiceDetail;
