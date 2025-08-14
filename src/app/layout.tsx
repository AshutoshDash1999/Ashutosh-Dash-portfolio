import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { detectLocale } from '../lib/detectLocale';
import { defaultSeo } from '../utils/defaultSeo';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = defaultSeo;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await detectLocale();
  const messages = (await import(`../messages/${locale}.json`)).default;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  );
}
