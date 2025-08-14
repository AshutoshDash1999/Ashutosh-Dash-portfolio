import { lazy, Suspense } from 'react';
import Navigation from '@/components/sections/Navigation';
import { PWAInstall } from '@/components/ui/PWAInstall';

// Lazy load all section components
const ContactSection = lazy(() => import('@/components/sections/Contact'));
const FreelanceSection = lazy(() => import('@/components/sections/Freelance'));
const Hero = lazy(() => import('@/components/sections/Hero'));
const Projects = lazy(() => import('@/components/sections/Project'));
const Skills = lazy(() => import('@/components/sections/Skills'));
const WorkExperience = lazy(() => import('@/components/sections/WorkExperience'));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
  </div>
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-4 py-20" role="main" id="main-content">
      <Navigation />

      <Suspense fallback={<SectionLoader />}>
        <Hero />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <WorkExperience />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Skills />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Projects />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FreelanceSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>

      <PWAInstall />
    </main>
  );
}
