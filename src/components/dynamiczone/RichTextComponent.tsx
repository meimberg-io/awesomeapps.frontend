import {RichTextBlock} from "../../types/strapi";

interface RichTextBlockProps {
    data: RichTextBlock;
}
const RichTextComponent: React.FC<RichTextBlockProps> = ({ data }) => {
    console.log("Inside RichText",data);
    return (
        <div className="rich-text"  >{data.body}</div>
    );
};

export default RichTextComponent;
