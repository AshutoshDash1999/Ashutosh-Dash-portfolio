import { Metadata } from 'next';

export const defaultSeo: Metadata = {
  metadataBase: new URL('https://ashutoshdash.com'),
  title: {
    default: 'Ashutosh Dash - Senior Frontend Developer & React Expert | India',
    template: '%s | Ashutosh Dash - Frontend Developer Portfolio',
  },
  description:
    'Ashutosh Dash is a Senior Frontend Developer and React Expert based in India. Specializing in React, Next.js, TypeScript, and modern web technologies. View portfolio, projects, and hire for freelance development services.',
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
    'React Expert',
    'Frontend Developer India',
    'React Developer India',
    'Next.js Developer India',
    'Web Developer India',
    'Freelance Web Developer',
    'React Portfolio',
    'Modern Web Development',
    'Responsive Web Design',
    'Progressive Web App',
    'Frontend Architecture',
    'Component-Based Development',
    'State Management',
    'Performance Optimization',
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
    title: 'Ashutosh Dash - Senior Frontend Developer & React Expert Portfolio',
    description:
      'Professional portfolio of Ashutosh Dash, a Senior Frontend Developer and React Expert based in India. Specializing in React, Next.js, TypeScript, and modern web technologies. Available for freelance projects.',
    siteName: 'Ashutosh Dash Portfolio',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Ashutosh Dash - Senior Frontend Developer & React Expert Portfolio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ashutoshdash',
    creator: '@ashutoshdash',
    title: 'Ashutosh Dash - Senior Frontend Developer & React Expert Portfolio',
    description:
      'Professional portfolio showcasing frontend development skills, React expertise, and creative web solutions. Available for freelance projects.',
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
    // Enhanced JSON-LD structured data
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ashutosh Dash',
      jobTitle: 'Senior Frontend Developer',
      description:
        'Senior Frontend Developer and React Expert specializing in React, Next.js, TypeScript, and modern web technologies. Available for freelance projects and full-time opportunities.',
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
        'Progressive Web Apps',
        'Performance Optimization',
        'State Management',
        'Component Architecture',
        'Modern Web Technologies',
        'Frontend Testing',
        'Build Tools',
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Senior Frontend Developer',
        description:
          'Creating high-performance, scalable web applications with modern frontend technologies',
      },
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance',
        description: 'Independent web development services for clients worldwide',
      },
      knowsLanguage: ['English', 'Hindi', 'Odia'],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: 'India',
      },
      alumniOf: {
        '@type': 'Organization',
        name: 'Web Development Industry',
      },
      hasCredential: [
        'React Developer Certification',
        'Next.js Expertise',
        'TypeScript Proficiency',
        'Modern Web Development',
      ],
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Frontend Development',
            description: 'Custom React and Next.js applications',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Application Development',
            description: 'Full-stack web solutions with modern technologies',
          },
        },
      ],
    }),
  },
};
