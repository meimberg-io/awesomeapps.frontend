type IconNodeEntry = [tag: string, attrs: Record<string, string>];

type IconNodeMap = Record<string, IconNodeEntry[]>;


import icons from 'lucide-static/icon-nodes.json';
export function renderIcon(name: string, className?: string, size: number = 16) {
    let node = (icons as unknown as IconNodeMap)[name];
    if (!node) {
        console.warn(`⚠️ Icon "${name}" nicht gefunden`);
        node = (icons as unknown as IconNodeMap)["tag"];
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={{
                verticalAlign: 'middle',
                display: 'inline-block',
            }}
        >
            {node.map(([tag, attrs], i) => {
                const Tag = tag as keyof JSX.IntrinsicElements;
                return <Tag key={i} {...attrs} />;
            })}
        </svg>
    );
}
