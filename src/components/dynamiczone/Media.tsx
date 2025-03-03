import {STRAPI_BASEURL} from "../../pages/_app";

export interface MediaProps {
    file: {
        url: string;
        alternativeText: string;
        mime: string;
    };
}

const Media: React.FC<MediaProps> = ({ file }) => {
    const isImage = file.mime.startsWith('image/');
    const isVideo = file.mime.startsWith('video/');

    return (
        <div className="media">
            {isImage && <img src={`${STRAPI_BASEURL}${file.url}`} alt={file.alternativeText} />}
            {isVideo && <video controls src={`${STRAPI_BASEURL}${file.url}`} />}
            {!isImage && !isVideo && <a href={`${STRAPI_BASEURL}${file.url}`} target="_blank" rel="noopener noreferrer">Datei herunterladen</a>}
        </div>
    );
};

export default Media;
