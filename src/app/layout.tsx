
import '@/styles/index.css'
import {ReactNode} from 'react'
import {MatomoTracker} from "@/components/util/MatomoTracker";

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="de" data-theme="dark">
        <body className="h-full">
        {children}
        <MatomoTracker />

        </body>
        </html>
    )
}
