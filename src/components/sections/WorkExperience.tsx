'use client';
import { motion } from 'motion/react';
import experiences from '@/data/experience.json';

export default function WorkExperience() {
  return (
    <section className="bg-muted/30 py-20" id="experience">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl font-black lg:text-7xl">WORK EXPERIENCE</h2>
          <div className="neobrutalist-card bg-primary inline-block p-4">
            <p className="text-primary-foreground font-mono">
              Building the web, one project at a time
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="bg-foreground absolute top-0 bottom-0 left-8 hidden w-1 md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-start gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="hidden items-center justify-center md:flex">
                  <div className={`neobrutalist-card ${exp.color} relative z-10 h-8 w-8`} />
                </div>

                {/* Content card */}
                <div className="max-w-2xl flex-1">
                  <div className="neobrutalist-card bg-card space-y-6 p-8">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className={`neobrutalist-card ${exp.color} inline-block p-2`}>
                        <span className="font-mono text-xs font-black text-white">
                          {exp.period}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black">{exp.title}</h3>
                      <h4 className="text-primary text-xl font-bold">{exp.company}</h4>
                    </div>

                    {/* Description */}
                    <p className="text-lg leading-relaxed">{exp.description}</p>

                    {/* Technologies */}
                    <div className="space-y-2">
                      <span className="text-sm">TECHNOLOGIES:</span>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map(tech => (
                          <span
                            key={tech}
                            className="neobrutalist-card bg-foreground text-background px-3 py-1 font-mono text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
