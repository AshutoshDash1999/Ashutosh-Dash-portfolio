import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { detectLocale } from '../lib/detectLocale';
import { defaultSeo } from '../utils/defaultSeo';
import './globals.css';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  ...defaultSeo,
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ashutosh Portfolio',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Ashutosh Portfolio',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await detectLocale();
  const messages = (await import(`../messages/${locale}.json`)).default;
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/icons/logo.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ashutosh Portfolio" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="application-name" content="Ashutosh Portfolio" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <Script src="/sw-register.js"></Script>
        <Script src="/manifest-debug.js"></Script>
      </body>
    </html>
  );
}
