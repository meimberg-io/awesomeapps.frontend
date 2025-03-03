import {STRAPI_BASEURL} from "../../pages/_app";

export interface SliderProps {
    files: Array<{ url: string; alternativeText: string }>;
}

const Slider: React.FC<SliderProps> = ({ files }) => {
    return (
        <div className="slider">
            {files.map((file, index) => (
                <img key={index} src={`${STRAPI_BASEURL}${file.url}`} alt={file.alternativeText} />
            ))}
        </div>
    );
};

export default Slider;
