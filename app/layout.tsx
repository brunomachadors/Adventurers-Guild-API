import type { Metadata } from 'next';
import { Cinzel, Cormorant_Garamond } from 'next/font/google';

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

export const metadata: Metadata = {
  title: 'Adventurers Guild API',
  description:
    'Fantasy-themed API project with a visual entrypoint, support hub, and interactive documentation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <div className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
