export interface QuoteProps {
    title: string;
    body: string;
}

const Quote: React.FC<QuoteProps> = ({ title, body }) => (
    <blockquote className="quote">
        <p className="quote-body">{body}</p>
        <footer>- {title}</footer>
    </blockquote>
);

export default Quote;
