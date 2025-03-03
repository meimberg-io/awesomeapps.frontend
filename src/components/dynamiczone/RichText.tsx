export interface RichTextProps {
    body: string;
}

const RichText: React.FC<RichTextProps> = ({ body }) => {
    return (
        <div className="rich-text" dangerouslySetInnerHTML={{ __html: body }} />
    );
};

export default RichText;
