import React from 'react';

import {Block, BlockProps, ComponentTypes, MediaBlock, QuoteBlock, RichTextBlock, SliderBlock} from "../../types/strapi";
import RichTextComponent from "./RichTextComponent";
import MediaComponent from "./MediaComponent";
import QuoteComponent from "./QuoteComponent";
import SliderComponent from "./SliderComponent";


interface DynamicZoneProps {
    blocks: Block[];
}


// Union-Typ für die möglichen Block-Typen, basierend auf den Props der jeweiligen Komponenten


const DynamicZoneComponent: React.FC<DynamicZoneProps> = ({blocks}) => {
    return (
        <div className="dynamic-zone">ccc
            {blocks.map((block, index) => {
                switch (block.__typename) {
                    case ComponentTypes.RichText:
                        console.log("DynamicZoneComponent", block);
                        // Übergebe den gesamten block, nicht nur block.props
                        return <RichTextComponent key={index} data={block as BlockProps<RichTextBlock>}/>;
                    case ComponentTypes.Media:
                        return <MediaComponent key={index} data={block as BlockProps<MediaBlock>}/>;
                    case ComponentTypes.Quote:
                        return <QuoteComponent key={index} data={block as BlockProps<QuoteBlock>} />;
                    case ComponentTypes.Slider:
                        return <SliderComponent key={index} data={block as BlockProps<SliderBlock>} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default DynamicZoneComponent;
