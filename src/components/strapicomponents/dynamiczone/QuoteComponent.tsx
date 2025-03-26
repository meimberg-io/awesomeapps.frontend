import {QuoteBlock} from "@/types/block";
import React from "react";

interface QuoteBlockProps {
    data: QuoteBlock;
}

const QuoteComponent: React.FC<QuoteBlockProps> = ({data}) => (
    <blockquote className="quote">
        <p className="quote-body">{data.body}</p>
        <footer>- {data.title}</footer>
    </blockquote>
);

export default QuoteComponent;
