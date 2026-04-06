import Experience from "@/components/sections/experience";
import FAQ from "@/components/sections/faq";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Reviews from "@/components/sections/reviews";
import TechSkills from "@/components/sections/tech-skills";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <TechSkills />
      <Experience />
      <Projects />
      <FAQ />
      <Reviews />
    </main>
  );
}
