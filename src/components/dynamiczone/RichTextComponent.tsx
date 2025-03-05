import {RichTextBlock} from "../../types/block";
import MarkdownRenderer from "../util/MarkdownRenderer";

interface RichTextBlockProps {
    data: RichTextBlock;
}

const RichTextComponent: React.FC<RichTextBlockProps> = ({data}) => {
    console.log("Inside RichText", data);
    return (
        <MarkdownRenderer content={data.body}/>
    );
};

export default RichTextComponent;
