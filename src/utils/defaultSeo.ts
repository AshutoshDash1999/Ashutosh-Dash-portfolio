import { Metadata } from 'next';

export const defaultSeo: Metadata = {
  metadataBase: new URL('https://ashutoshdash.com'),
  title: 'Frontend Developer Portfolio',
  description: 'Portfolio showcasing frontend development skills and projects',
  //   canonical: "https://yourdomain.com",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'Frontend Developer Portfolio',
    description: 'Portfolio showcasing frontend development skills and projects',
    siteName: 'Frontend Portfolio',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio Preview',
      },
    ],
  },
  twitter: {
    // handle: "@yourhandle",
    site: '@yourhandle',
    // cardType: "summary_large_image",
  },
};
