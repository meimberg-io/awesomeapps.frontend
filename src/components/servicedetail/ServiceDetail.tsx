import React from "react";
import {Service} from "../../types/service";
import RichTextBlocks from "../strapicomponents/richtextblocks/RichTextBlocks";
import DynamicZoneComponent from "../strapicomponents/dynamiczone/DynamicZoneComponent";
import {ArrowRightCircleIcon} from "@heroicons/react/20/solid";
import MarkdownRenderer from "../util/MarkdownRenderer";
import {EffectCoverflow, Navigation, Pagination, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import {STRAPI_BASEURL} from "../../pages/_app";

import 'swiper/css';
import 'swiper/css/navigation';   // wenn du Navigation-Pfeile nutzen willst
import 'swiper/css/pagination';   // wenn du Pagination-Punkte nutzen willst
import 'swiper/css/autoplay';   // wenn du Pagination-Punkte nutzen willst

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


            {/* screenshots */}

            {service.screenshots && service.screenshots.length > 0 ? (

                <div className="mb-16">
                    <h2>Screenshots</h2>

                    <div className="border-2 border-gray-200">
                        <div className="mb-16  ">
                            <Swiper
                                effect={'coverflow'}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={'auto'}
                                loop={true}
                                navigation={false}
                                autoplay={true}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true,
                                }}
                                pagination={true}
                                modules={[Autoplay, Pagination, EffectCoverflow, Navigation]}
                                className="mySwiper"
                            >
                                {service.screenshots.map((shot) => (

                                    <SwiperSlide key={shot.documentId}>
                                        <img
                                            src={STRAPI_BASEURL + shot.url}
                                            alt={shot.caption || `Screenshot ${shot.documentId}`}
                                            style={{width: '100%', height: 'auto'}}
                                        />
                                        {shot.caption && (
                                            <p style={{textAlign: 'center', marginTop: '8px'}}>{shot.caption}</p>
                                        )}
                                    </SwiperSlide>

                                ))}
                            </Swiper>
                        </div>
                    </div>


                </div>
            ) : (
               <></>
            )}

            {/* pricing */}

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
