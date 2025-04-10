"use client";
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function Youtube({ video, title }: { video: string; title?: string }) {
    return (
        <div className="w-full overflow-hidden rounded-lg">
            {title && <h2>Video: {title}</h2>}
            <ReactPlayer url={'https://www.youtube.com/watch?v=' + video} width="100%" />
        </div>
    );
}