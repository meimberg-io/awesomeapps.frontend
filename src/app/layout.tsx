import '@/styles/index.css'
import {ReactNode} from 'react'
import {MatomoTracker} from "@/components/util/MatomoTracker";
import Providers from "@/components/Providers";
import { Manrope } from 'next/font/google'
import type { Metadata } from 'next'
import {Locale} from '@/types/locale';

const manrope = Manrope({ 
    subsets: ['latin'],
    variable: '--font-manrope',
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL('https://awesomeapps.meimberg.io'),
    keywords: ['SaaS', 'Software', 'Web Apps', 'Online Tools', 'Produktivität', 'Business Software', 'Cloud Services'],
    authors: [{ name: 'AwesomeApps' }],
    creator: 'AwesomeApps',
    publisher: 'AwesomeApps',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
}

type Props = {
    children: ReactNode;
    params: Promise<{locale: Locale}>;
};

export default async function RootLayout({children, params}: Props) {
    const {locale} = await params;
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "AwesomeApps",
        "url": "https://awesomeapps.meimberg.io",
        "logo": "https://awesomeapps.meimberg.io/logo-full.svg",
        "description": "Best of Breed der Apps & Online Tools - Die beste Auswahl an SaaS-Tools und Online-Apps"
    }

    return (
        <html lang={locale} className={manrope.variable}>
        <body className={`h-full ${manrope.className}`}>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Providers>
            {children}
            <MatomoTracker />
        </Providers>
        </body>
        </html>
    )
}
