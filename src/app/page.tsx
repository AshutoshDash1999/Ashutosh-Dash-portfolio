import Hero from '@/components/sections/Hero';
import Navigation from '@/components/sections/Navigation';
import Projects from '@/components/sections/Project';
import Skills from '@/components/sections/Skills';
import WorkExperience from '@/components/sections/WorkExperience';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-4 py-20">
      <Navigation />

      <Hero />
      <WorkExperience />
      <Skills />
      <Projects />
    </main>
  );
}
