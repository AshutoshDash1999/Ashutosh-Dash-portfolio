import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import data from "@/lib/data.json";

export default function TechSkills() {
  const { techSkills } = data;

  const categories = Array.from(new Set(techSkills.map((skill) => skill.category)));
  const skillsByCategory = categories.map((category) => ({
    category,
    skills: techSkills.filter((skill) => skill.category === category),
  }));

  return (
    <section
      id="skills"
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-heading mb-8 md:mb-12"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Tech Skills
      </motion.h2>
      <div className="space-y-8">
        {skillsByCategory.map(({ category, skills }) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 className="text-xl md:text-2xl font-heading mb-4">
              {category}
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <Badge key={skill.name} variant="default">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
