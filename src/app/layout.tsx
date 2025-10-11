import '@/styles/index.css'
import {ReactNode} from 'react'
import {MatomoTracker} from "@/components/util/MatomoTracker";
import Providers from "@/components/Providers";
import { Manrope } from 'next/font/google'

const manrope = Manrope({ 
    subsets: ['latin'],
    variable: '--font-manrope',
    display: 'swap',
})

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="de" className={manrope.variable}>
        <body className={`h-full ${manrope.className}`}>
        <Providers>
            {children}
            <MatomoTracker />
        </Providers>
        </body>
        </html>
    )
}
