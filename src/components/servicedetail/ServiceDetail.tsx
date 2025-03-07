import React from "react";
import {Service} from "../../types/service";
import RichTextBlocks from "../strapicomponents/richtextblocks/RichTextBlocks";
import DynamicZoneComponent from "../strapicomponents/dynamiczone/DynamicZoneComponent";
import {ArrowRightCircleIcon} from "@heroicons/react/20/solid";
interface Props {
    service: Service;
}

const ServiceDetail: React.FC<Props> = ({ service }) => {
    return (

        <div className="pt-6 pb-4 sm:pb-6 max-w-7xl gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8  mx-auto">
            <RichTextBlocks content={service.longdescription}/>

            {service.longdescription && <DynamicZoneComponent blocks={service.articlecontent} />}

            <div role="alert" className="alert my-6 bg-green-100 border-0 text-green-800 font-bold shadow-sm">
                <ArrowRightCircleIcon aria-hidden="true" className="size-6 text-green-800"/>
                <a href={service.url} target="_blank">{service.url}</a>
            </div>

        </div>
    );
};

export default ServiceDetail;
