import {QuoteBlock} from "../../types/block";

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
