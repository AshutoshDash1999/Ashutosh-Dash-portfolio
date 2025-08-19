'use client';
import { motion } from 'motion/react';
import skillsData from '@/data/skills.json';

// Motion variants for section header
const sectionHeaderVariants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

// Motion variants for skill category cards
const skillCategoryVariants = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

// Motion variants for individual skill items
const skillItemVariants = {
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  hover: { x: 8 },
};

// Individual motion values
const skillItemHover = { x: 8 };
const skillItemViewport = { once: true };

// Map JSON categories to display categories with colors
const categoryMapping = {
  languages: { title: 'LANGUAGES', color: 'bg-destructive' },
  frameworks_libraries: { title: 'FRAMEWORKS & LIBRARIES', color: 'bg-primary' },
  tools: { title: 'TOOLS & PLATFORMS', color: 'bg-accent' },
};

export default function Skills() {
  return (
    <section className="bg-background py-20" id="skills" data-testid="skills-section">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          data-testid="skills-header"
          initial={sectionHeaderVariants.initial}
          whileInView={sectionHeaderVariants.whileInView}
          viewport={sectionHeaderVariants.viewport}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl font-black lg:text-7xl">SKILLS & TECH STACK</h2>
          <div className="neobrutalist-card bg-accent inline-block p-4">
            <p className="text-accent-foreground font-mono">
              Tools and technologies I use to build amazing things
            </p>
          </div>
          <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg">
            A comprehensive collection of programming languages, frameworks, and tools that enable
            me to create exceptional web experiences and solve complex technical challenges.
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3" data-testid="skills-grid">
          {Object.entries(skillsData).map(([categoryKey, skills], categoryIndex) => {
            const category = categoryMapping[categoryKey as keyof typeof categoryMapping];
            if (!category) return null;

            return (
              <motion.div
                key={categoryKey}
                data-testid={`skills-category-${categoryKey}`}
                initial={skillCategoryVariants.initial}
                whileInView={skillCategoryVariants.whileInView}
                viewport={skillCategoryVariants.viewport}
                transition={{ delay: categoryIndex * 0.1 }}
                className="space-y-4"
              >
                {/* Category header */}
                <div className={`neobrutalist-card ${category.color} p-4`}>
                  <h3 className="text-2xl font-black text-white">{category.title}</h3>
                </div>

                {/* Skills list */}
                <div className="space-y-3" data-testid={`skills-list-${categoryKey}`}>
                  {skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill}
                      data-testid={`skill-item-${skill.toLowerCase().replaceAll(' ', '-')}`}
                      initial={skillItemVariants.initial}
                      whileInView={skillItemVariants.whileInView}
                      viewport={skillItemViewport}
                      whileHover={skillItemHover}
                      transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                      className="neobrutalist-card bg-card group cursor-pointer p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="group-hover:text-primary text-lg font-black transition-colors">
                          {skill}
                        </span>
                        <div className="bg-primary group-hover:bg-secondary h-2 w-2 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
