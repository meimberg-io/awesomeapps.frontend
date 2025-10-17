import {MediaBlock} from "@/types/block";
import {STRAPI_BASEURL} from "@/lib/constants";
import React from "react";


interface MediaBlockProps {
    data: MediaBlock;
}
const MediaComponent: React.FC<MediaBlockProps> = ({ data }) => {
    const isImage = data.file.mime.startsWith('image/');
    const isVideo = data.file.mime.startsWith('video/');

    return (
        <div className="media mt-12 mb-16">
            {isImage && <img src={`${STRAPI_BASEURL}${data.file.url}`} alt={data.file.alternativeText} className="rounded-lg shadow-xl" />}
            {isVideo && <video controls src={`${STRAPI_BASEURL}${data.file.url}`} className="rounded-lg shadow-xl" />}
            {!isImage && !isVideo && <a href={`${STRAPI_BASEURL}${data.file.url}`} target="_blank" rel="noopener noreferrer">Datei herunterladen</a>}
        </div>
    );
};

export default MediaComponent;
