"use client"
import React from 'react';

import RichTextComponent from "./RichTextComponent";
import MediaComponent from "./MediaComponent";
import QuoteComponent from "./QuoteComponent";
import SliderComponent from "./SliderComponent";
import {Block, BlockProps, ComponentTypes, MediaBlock, QuoteBlock, RichTextBlock, SliderBlock} from "@/types/block";

interface DynamicZoneProps {
    blocks: Block[];
}

const DynamicZoneComponent: React.FC<DynamicZoneProps> = ({blocks}) => {

    return (
        <div className="dynamic-zone">
            {blocks.map((block, index) => {
                switch (block.__typename) {
                    case ComponentTypes.RichText:
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
