import type React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import { ScrollToTop } from '@/components/scroll-to-top';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { GoogleAnalytics } from '@/components/google-analytics';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Headway Trips - Tu Agencia de Viajes de Confianza',
    template: '%s | Headway Trips',
  },
  manifest: '/manifest.json', // Link manifest
  description: 'Descubrí destinos únicos alrededor del mundo con Headway Trips. Creamos experiencias de viaje inolvidables en Europa, Asia, América, Oceanía y más.',
  keywords: ['viajes', 'turismo', 'agencia de viajes', 'viajes internacionales', 'París', 'Tokio', 'Nueva York', 'Dubai', 'Headway Trips', 'viajes globales'],
  authors: [{ name: 'Headway Trips' }],
  creator: 'Headway Trips',
  publisher: 'Headway Trips',
  alternates: {
    canonical: './',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://headwaytrips.com'),
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://headwaytrips.com',
    siteName: 'Headway Trips',
    title: 'Headway Trips - Tu Agencia de Viajes de Confianza',
    description: 'Descubrí destinos únicos con Headway Trips. Creamos experiencias de viaje inolvidables.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Headway Trips - Agencia de Viajes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Headway Trips - Tu Agencia de Viajes',
    description: 'Descubrí destinos únicos con Headway Trips.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/1.png', media: '(prefers-color-scheme: light)' },
      { url: '/3.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/1.png',
  },
  generator: 'v0.app',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a365d' },
    { media: '(prefers-color-scheme: dark)', color: '#c9a962' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* DNS Prefetch and Preconnect for critical origins */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical assets */}
        <link rel="preload" href="/fonts" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* Resource hints for analytics and monitoring */}
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <ScrollToTop />
        <WhatsAppButton />
        <Analytics />
        <GoogleAnalytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
