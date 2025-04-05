// types/lucide-icon.d.ts
declare module 'lucide-static/icons.json' {
    const icons: Record<
        string,
        {
            body: string;
            width: number;
            height: number;
            viewBox?: string;
        }
    >;
    export default icons;
}
