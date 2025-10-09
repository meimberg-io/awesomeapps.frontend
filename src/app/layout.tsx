import '@/styles/index.css'
import {ReactNode} from 'react'
import {MatomoTracker} from "@/components/util/MatomoTracker";
import Providers from "@/components/Providers";

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="de">
        <body className="h-full">
        <Providers>
            {children}
            <MatomoTracker />
        </Providers>
        </body>
        </html>
    )
}
