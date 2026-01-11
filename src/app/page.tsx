import Navbar from "@/components/navbar";
import Hero from "@/components/sections/hero";
import TechSkills from "@/components/sections/tech-skills";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import Freelance from "@/components/sections/freelance";
import Reviews from "@/components/sections/reviews";
import SocialLinks from "@/components/sections/social-links";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TechSkills />
      <Experience />
      <Projects />
      <Freelance />
      <Reviews />
      <SocialLinks />
      <Footer />
    </main>
  );
}
