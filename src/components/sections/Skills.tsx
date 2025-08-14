'use client';
import { motion } from 'motion/react';

const skillCategories = [
  {
    title: 'FRONTEND',
    color: 'bg-primary',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Redux'],
  },
  {
    title: 'BACKEND',
    color: 'bg-secondary',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Firebase', 'Supabase'],
  },
  {
    title: 'TOOLS',
    color: 'bg-accent',
    skills: ['Git', 'Docker', 'Figma', 'VS Code', 'Webpack', 'Vite'],
  },
  {
    title: 'LANGUAGES',
    color: 'bg-destructive',
    skills: ['JavaScript', 'TypeScript', 'Python', 'PHP', 'HTML', 'CSS'],
  },
];

export default function Skills() {
  return (
    <section className="bg-background py-20" id="skills">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="space-y-4"
            >
              {/* Category header */}
              <div className={`neobrutalist-card ${category.color} p-4`}>
                <h3 className="text-2xl font-black text-white">{category.title}</h3>
              </div>

              {/* Skills list */}
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ x: 8 }}
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
          ))}
        </div>
      </div>
    </section>
  );
}
