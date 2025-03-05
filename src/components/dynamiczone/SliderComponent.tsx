import {STRAPI_BASEURL} from "../../pages/_app";
import {SliderBlock} from "../../types/block";


interface SliderBlockProps {
    data: SliderBlock;
}

const SliderComponent: React.FC<SliderBlockProps> = ({ data }) => {
    return (
        <div className="slider">
            {data.files.map((file, index) => (
                <img key={index} src={`${STRAPI_BASEURL}${file.url}`} alt={file.alternativeText} />
            ))}
        </div>
    );
};

export default SliderComponent;
