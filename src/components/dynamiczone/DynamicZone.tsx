import React from 'react';
import RichText, { RichTextProps } from './RichText';
import Media, { MediaProps } from './Media';
import Quote, { QuoteProps } from './Quote';
import Slider, { SliderProps } from './Slider';

// Union-Typ für die möglichen Block-Typen, basierend auf den Props der jeweiligen Komponenten
type Block =
    | { __component: 'shared.rich-text'; props: RichTextProps }
    | { __component: 'shared.media'; props: MediaProps }
    | { __component: 'shared.quote'; props: QuoteProps }
    | { __component: 'shared.slider'; props: SliderProps };

interface DynamicZoneProps {
    blocks: Block[];
}

const DynamicZone: React.FC<DynamicZoneProps> = ({ blocks }) => {
    return (
        <div className="dynamic-zone">
            {blocks.map((block, index) => {
                switch (block.__component) {
                    case 'shared.rich-text':
                        return <RichText key={index} {...block.props} />;
                    case 'shared.media':
                        return <Media key={index} {...block.props} />;
                    case 'shared.quote':
                        return <Quote key={index} {...block.props} />;
                    case 'shared.slider':
                        return <Slider key={index} {...block.props} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default DynamicZone;
