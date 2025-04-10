"use client";
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function Youtube({ video, title }: { video: string; title?: string }) {
    return (


        <div className="relative w-full pb-[56%]">
            <div className="absolute top-0 left-0 w-full h-full">
                <ReactPlayer url={'https://www.youtube.com/watch?v=' + video} width="100%" height="100%"/>
            </div>
        </div>
        // <div className="w-full overflow-hidden rounded-lg">
        //     {title && <h2>Video: {title}</h2>}
        //     <ReactPlayer url={'https://www.youtube.com/watch?v=' + video} width="100%" height="100%"/>
        // </div>
    );
}