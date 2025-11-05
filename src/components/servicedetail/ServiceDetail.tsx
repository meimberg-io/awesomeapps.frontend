import React from "react";
import {Service} from "@/types/service";
import DynamicZoneComponent from "@/components/strapicomponents/dynamiczone/DynamicZoneComponent";
import MarkdownRenderer from "@/components/util/MarkdownRenderer";
import {Screenshots} from "@/components/util/Screenshots";
import Youtube from "@/components/Youtube";
import {useTranslations} from 'next-intl';

interface Props {
    service: Service;
}

const ServiceDetail: React.FC<Props> = ({service}) => {
    const t = useTranslations('serviceDetail');
    
    return (

        <div className="pt-0 pb-4 sm:pb-6 max-w-screen-2xl gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 mx-auto contentsection">

            {/* description */}

            {service.description && (
                <div className="mb-16">
                    <MarkdownRenderer content={service.description}/>
                </div>
            )}

            {/* functionality */}

            {service.functionality && (
                <div className="mb-16">
                    <h2>Funktionen und Einsatzmöglichkeiten</h2>
                    <MarkdownRenderer content={service.functionality}/>
                </div>
            )}

            {/* screenshots */}

            {(service.screenshots && service.screenshots.length > 0) &&  <Screenshots service={service}/>  }

            {/* pricing */}

            {service.pricing && (
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 mt-5">{t('prices')}</h2>
                    <MarkdownRenderer content={service.pricing}/>

                    <p className="mt-4 text-sm text-right italic text-gray-200 ">{t('priceDisclaimer')} <a href={service.url}>{service.url}</a></p>
                </div>
            )}
           

            {service.youtube_video && <Youtube video={service.youtube_video} title={service.youtube_title}/>}


        </div>
    );
};

export default ServiceDetail;
