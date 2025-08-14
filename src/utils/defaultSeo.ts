import { Metadata } from 'next';

export const defaultSeo: Metadata = {
  metadataBase: new URL('https://ashutoshdash.com'),
  title: {
    default: 'Ashutosh Dash - Frontend Developer & Freelancer Portfolio',
    template: '%s | Ashutosh Dash Portfolio',
  },
  description:
    'Professional portfolio of Ashutosh Dash, a skilled Frontend Developer and Freelancer specializing in React, Next.js, TypeScript, and modern web technologies. View projects, skills, and work experience.',
  keywords: [
    'Frontend Developer',
    'React Developer',
    'Next.js Developer',
    'TypeScript Developer',
    'Web Developer',
    'Freelance Developer',
    'Portfolio',
    'Web Development',
    'UI/UX Design',
    'JavaScript Developer',
  ],
  authors: [{ name: 'Ashutosh Dash' }],
  creator: 'Ashutosh Dash',
  publisher: 'Ashutosh Dash',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ashutoshdash.com',
    title: 'Ashutosh Dash - Frontend Developer & Freelancer Portfolio',
    description:
      'Professional portfolio showcasing frontend development skills, projects, and creative web solutions. Specializing in React, Next.js, and modern web technologies.',
    siteName: 'Ashutosh Dash Portfolio',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Ashutosh Dash - Frontend Developer Portfolio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ashutoshdash',
    creator: '@ashutoshdash',
    title: 'Ashutosh Dash - Frontend Developer & Freelancer Portfolio',
    description:
      'Professional portfolio showcasing frontend development skills, projects, and creative web solutions.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: 'https://ashutoshdash.com',
  },
  category: 'technology',
  classification: 'Portfolio Website',
  other: {
    'theme-color': '#3b82f6',
    'color-scheme': 'light dark',
    // JSON-LD structured data
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ashutosh Dash',
      jobTitle: 'Frontend Developer',
      description:
        'Professional Frontend Developer and Freelancer specializing in React, Next.js, TypeScript, and modern web technologies.',
      url: 'https://ashutoshdash.com',
      sameAs: ['https://github.com/ashutoshdash', 'https://linkedin.com/in/ashutoshdash'],
      knowsAbout: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'Web Development',
        'Frontend Development',
        'UI/UX Design',
        'Responsive Design',
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Frontend Developer',
        description: 'Creating interactive web experiences with modern technologies',
      },
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance',
        description: 'Independent web development services',
      },
      knowsLanguage: ['English', 'Hindi'],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    }),
  },
};
