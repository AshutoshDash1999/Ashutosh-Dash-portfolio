"use client";

import Navbar from "@/components/navbar";
import Experience from "@/components/sections/experience";
import Footer from "@/components/sections/footer";
import Freelance from "@/components/sections/freelance";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Reviews from "@/components/sections/reviews";
import SocialLinks from "@/components/sections/social-links";
import TechSkills from "@/components/sections/tech-skills";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="px-12 flex flex-col gap-4">
        <Hero />
        <TechSkills />
        <Experience />
        <Projects />
        <Freelance />
        <Reviews />
        <SocialLinks />
      </div>
      <Footer />
    </main>
  );
}
