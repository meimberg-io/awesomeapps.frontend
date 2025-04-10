"use client"
import React from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules'
import { STRAPI_BASEURL } from '@/lib/constants'
import { Service } from '@/types/service'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
export function Screenshots({ service }: { service: Service }) {

    return <div className="mb-16">


    <h2>Screenshots</h2>
        <div className="rounded-lg overflow-hidden">
        <div className="border-2 border-gray-200">
            <div className="mb-0  ">
                <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={"auto"}
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


    </div>;
}
