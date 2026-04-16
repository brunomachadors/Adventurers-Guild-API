import type { Metadata } from 'next';
import { Cinzel, Cormorant_Garamond, MedievalSharp } from 'next/font/google';

import { SiteHeader } from '@/app/components/site-header';
import { SiteFooter } from '@/app/components/site-footer';

import './globals.css';

const headingFont = Cinzel({
  subsets: ['latin'],
  variable: '--font-heading',
});

const bodyFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const handFont = MedievalSharp({
  subsets: ['latin'],
  variable: '--font-hand',
  weight: '400',
});

const sitePreviewImage =
  'https://res.cloudinary.com/dtglidvcw/image/upload/v1776330779/adventurers/site_preview_syrxgm.jpg';

export const metadata: Metadata = {
  metadataBase: new URL('https://adventurers-guild-api.vercel.app'),
  title: {
    default: 'Adventurers Guild API',
    template: '%s | Adventurers Guild API',
  },
  description:
    'A fantasy-themed API portal with educational guides, RPG resources, and interactive documentation for building D&D-inspired character workflows.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Adventurers Guild API',
    description:
      'Explore a D&D-inspired API portal with guides for attributes, skills, classes, species, and character-building resources.',
    url: '/',
    siteName: 'Adventurers Guild API',
    images: [
      {
        url: sitePreviewImage,
        width: 1536,
        height: 1024,
        alt: 'Adventurers Guild API fantasy campaign codex banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adventurers Guild API',
    description:
      'A fantasy-themed API portal with educational guides and interactive documentation for D&D-inspired resources.',
    images: [sitePreviewImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${handFont.variable}`}
      >
        <div className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
