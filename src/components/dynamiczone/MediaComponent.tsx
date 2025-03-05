import {STRAPI_BASEURL} from "../../pages/_app";
import {MediaBlock} from "../../types/block";


interface MediaBlockProps {
    data: MediaBlock;
}
const MediaComponent: React.FC<MediaBlockProps> = ({ data }) => {
    const isImage = data.file.mime.startsWith('image/');
    const isVideo = data.file.mime.startsWith('video/');

    return (
        <div className="media">
            {isImage && <img src={`${STRAPI_BASEURL}${data.file.url}`} alt={data.file.alternativeText} />}
            {isVideo && <video controls src={`${STRAPI_BASEURL}${data.file.url}`} />}
            {!isImage && !isVideo && <a href={`${STRAPI_BASEURL}${data.file.url}`} target="_blank" rel="noopener noreferrer">Datei herunterladen</a>}
        </div>
    );
};

export default MediaComponent;
