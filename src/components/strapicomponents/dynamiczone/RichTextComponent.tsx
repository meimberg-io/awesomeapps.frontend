import {RichTextBlock} from "@/types/block";
import MarkdownRenderer from "@/components/util/MarkdownRenderer";
import React from "react";

interface RichTextBlockProps {
    data: RichTextBlock;
}

const RichTextComponent: React.FC<RichTextBlockProps> = ({data}) => {
    return (
        <MarkdownRenderer content={data.body}/>
    );
};

export default RichTextComponent;
