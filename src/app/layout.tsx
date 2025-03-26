
import '@/styles/index.css'
import {ReactNode} from 'react'

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="de" data-theme="dark">
        <body className="h-full">
        {children}
        </body>
        </html>
    )
}
