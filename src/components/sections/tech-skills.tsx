"use client";
import Marquee from "@/components/ui/marquee";
import data from "@/lib/data.json";
import {
    IconBrandBootstrap,
    IconBrandCss3,
    IconBrandFirebase,
    IconBrandGit,
    IconBrandGithub,
    IconBrandHtml5,
    IconBrandJavascript,
    IconBrandMantine,
    IconBrandNextjs,
    IconBrandNodejs,
    IconBrandReact,
    IconBrandTailwind,
    IconBrandTypescript,
    IconCode,
    IconPalette,
} from "@tabler/icons-react";
import { motion } from "motion/react";

const iconMap: Record<
    string,
    React.ComponentType<{ className?: string; size?: number | string }>
> = {
    React: IconBrandReact,
    "Next.js": IconBrandNextjs,
    "React Native": IconBrandReact,
    TypeScript: IconBrandTypescript,
    JavaScript: IconBrandJavascript,
    HTML: IconBrandHtml5,
    CSS: IconBrandCss3,
    "Mantine UI": IconBrandMantine,
    "Ant Design": IconPalette,
    "Material UI": IconPalette,
    "Chakra UI": IconPalette,
    "Tailwind CSS": IconBrandTailwind,
    Bootstrap: IconBrandBootstrap,
    "Node.js": IconBrandNodejs,
    Firebase: IconBrandFirebase,
    Git: IconBrandGit,
    GitHub: IconBrandGithub,
};

export default function TechSkills() {
    const { techSkills } = data;

    const skillItems = techSkills.map((skill) => {
        const Icon = iconMap[skill.name] || IconCode;
        return (
            <div key={skill.name} className="inline-flex items-center gap-3 md:gap-2 p-3 md:p-2">
                <Icon className="size-10 md:size-12" />
                <span className="text-xl md:text-2xl font-medium">{skill.name}</span>
            </div>
        );
    });

    return (
        <section id="skills" className="  py-16 md:py-24">
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
