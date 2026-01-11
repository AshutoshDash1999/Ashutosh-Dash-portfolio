import Marquee from "@/components/ui/marquee";
import data from "@/lib/data.json";
import {
  IconBrandAws,
  IconBrandDocker,
  IconBrandGit,
  IconBrandJavascript,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandPython,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandTypescript,
  IconCloud,
  IconCode,
  IconDatabase,
} from "@tabler/icons-react";
import { motion } from "motion/react";

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string; size?: number | string }>
> = {
  React: IconBrandReact,
  "Next.js": IconBrandNextjs,
  TypeScript: IconBrandTypescript,
  "Node.js": IconBrandNodejs,
  Express: IconCode,
  PostgreSQL: IconDatabase,
  MongoDB: IconDatabase,
  "Tailwind CSS": IconBrandTailwind,
  Git: IconBrandGit,
  Docker: IconBrandDocker,
  AWS: IconBrandAws,
  Python: IconBrandPython,
};

export default function TechSkills() {
  const { techSkills } = data;

  const skillItems = techSkills.map((skill) => {
    const Icon = iconMap[skill.name] || IconCode;
    return (
      <div
        key={skill.name}
        className="inline-flex items-center gap-2 px-12 py-2"
      >
        <Icon className="size-12" />
        <span className="text-2xl font-medium">{skill.name}</span>
      </div>
    );
  });

  return (
    <section id="skills" className="container mx-auto py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Marquee items={skillItems} />
      </motion.div>
    </section>
  );
}
