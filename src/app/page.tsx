import ContactSection from '@/components/sections/Contact';
import FreelanceSection from '@/components/sections/Freelance';
import Hero from '@/components/sections/Hero';
import Navigation from '@/components/sections/Navigation';
import Projects from '@/components/sections/Project';
import Skills from '@/components/sections/Skills';
import WorkExperience from '@/components/sections/WorkExperience';

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
