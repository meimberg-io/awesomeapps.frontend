'use client'

import React from 'react'
import {STRAPI_BASEURL} from "../pages/_app";
import {Image} from "../types/image";

export enum PageHeaderStyle {
    SERVICE = 'service',
    PAGE = 'page',
}

export interface PageHeaderProps {
    title: string;
    subtitle: string | null;
    icon?: Image | null;
    style: PageHeaderStyle;

}

const PageHeader: React.FC<PageHeaderProps> = ({title, subtitle, icon, style}) => {

    let style_color_bg: string = "";
    let style_color_text: string = "";


    switch (style) {
        case PageHeaderStyle.SERVICE:
            style_color_bg = "bg-sasecondary-300";
            style_color_text = "text-white";
            break;
        case PageHeaderStyle.PAGE:
            style_color_bg = "bg-saprimary-200";
            style_color_text = "text-white";
            break;
        default:
            style_color_bg = "bg-sasecondary-50";
            style_color_text = "text-sasecondary-950";
            break;
    }

    const iconurl = icon?.url ? `${STRAPI_BASEURL}${icon.url}` : "/dummy.svg";

    return (
        <header className={`py-8  ${style_color_bg} `}>
            <div className="mx-auto flex max-w-7xl flex-row items-stretch gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 justify-between">
                <div>
                    <h1 className={`text-xl2 mb-0 mt-0 font-semibold ${style_color_text}`}>{title}</h1>
                    <p className={`text-lg mt-2 ${style_color_text}`}>{subtitle}</p>
                </div>

                <figure className="w-20 h-20 rounded-full bg-white flex items-center justify-center ">
                    <img src={iconurl} alt={title} className="max-h-10 max-w-10 "/>
                </figure>


            </div>
        </header>


    )
}
export default PageHeader;
