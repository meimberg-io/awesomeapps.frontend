'use client'

import React from 'react'
import {Image} from "@/types/image";
import {STRAPI_BASEURL} from "@/lib/constants";
import {renderIcon} from "@/components/util/renderIcon";
import {PageHeaderStyle} from "@/types/PageHeaderStyle";


export interface PageHeaderProps {
    title: string;
    subtitle: string | null;
    icon?: Image | null;
    iconname?: string | null;
    style: PageHeaderStyle;

}

const PageHeader: React.FC<PageHeaderProps> = ({title, subtitle, icon, iconname, style}) => {

    let style_color_bg: string;
    let style_color_text: string;
    let style_bg_icon: string;
    let style_color_icon: string = "text-saprimary-200";
    let style_color_border: string = "border-saprimary-200";

    console.log("PageHeader", style, iconname, title);

    switch (style) {
        case PageHeaderStyle.SERVICE:
            style_color_bg = "bg-sasecondary-300";
            style_color_text = "text-white";
            style_bg_icon = "bg-white";
            break;
        case PageHeaderStyle.TAG:
            style_color_bg = "bg-gray-700";
            style_color_text = "text-white";
            style_bg_icon = "bg-white";
            style_color_icon = "text-saprimary-200";
            style_color_border = "text-sasecondary-200";

            break;
        case PageHeaderStyle.PAGE:
            style_color_bg = "bg-saprimary-200";
            style_color_text = "text-white";
            style_bg_icon = "bg-white";

            break;
        case PageHeaderStyle.NEWS:
            style_color_bg = "bg-gray-700";
            style_color_text = "text-white";
            style_bg_icon = "bg-white";
            style_color_icon = "text-sasecondary-200";
            style_color_border = "border-sasecondary-200";
            break;
        default:
            style_color_bg = "bg-sasecondary-50";
            style_color_text = "text-sasecondary-950";
            style_bg_icon = "bg-white";

            break;
    }

    return (
        <header className={`py-8  ${style_color_bg} `}>
            <div className="mx-auto flex max-w-7xl flex-row items-stretch gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 justify-between">
                <div>
                    <h1 className={`text-xl2 mb-0 mt-0 font-semibold ${style_color_text}`}>{title}</h1>
                    <p className={`text-lg mt-2 ${style_color_text}`}>{subtitle}</p>
                </div>
                {iconname && (
                    <figure className={`w-20 h-20 rounded-full border-2 ${style_color_border} flex items-center justify-center  ${style_bg_icon}`}>
                        {renderIcon(iconname, `${style_color_icon} mr-1`, 40)}
                    </figure>
                )
                }
                {icon && (
                    <figure className={`w-20 h-20 rounded-full flex items-center justify-center  ${style_bg_icon}`}>
                        <img src={icon.url ? `${STRAPI_BASEURL}${icon.url}` : "/dummy.svg"} alt={title} className="max-h-10 max-w-10 "/>
                    </figure>
                )
                }


            </div>
        </header>


    )
}
export default PageHeader;
