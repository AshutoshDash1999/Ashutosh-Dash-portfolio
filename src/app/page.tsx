'use client';

import Navigation from '@/components/sections/Navigation';
import dynamic from 'next/dynamic';

// Loading fallback component
const SectionLoader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
  </div>
);

// Dynamically load all section components with loading property
const ContactSection = dynamic(() => import('@/components/sections/Contact'), {
  ssr: false,
  loading: () => <SectionLoader />,
});
const FreelanceSection = dynamic(() => import('@/components/sections/Freelance'), {
  ssr: false,
  loading: () => <SectionLoader />,
});
const Hero = dynamic(() => import('@/components/sections/Hero'), {
  ssr: false,
  loading: () => <SectionLoader />,
});
const Projects = dynamic(() => import('@/components/sections/Project'), {
  ssr: false,
  loading: () => <SectionLoader />,
});
const Skills = dynamic(() => import('@/components/sections/Skills'), {
  ssr: false,
  loading: () => <SectionLoader />,
});
const WorkExperience = dynamic(() => import('@/components/sections/WorkExperience'), {
  ssr: false,
  loading: () => <SectionLoader />,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-4 py-20" role="main" id="main-content">
      <Navigation />
      <Hero />
      <WorkExperience />
      <Skills />
      <Projects />
      <FreelanceSection />
      <ContactSection />
    </main>
  );
}
