'use client';
import { motion } from 'motion/react';
import experiences from '@/data/experience.json';

// Color mapping for projects
const experienceColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-destructive'];

export default function WorkExperience() {
  return (
    <section className="bg-muted/30 py-20" id="experience" data-testid="experience-section">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          data-testid="experience-header"
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
          <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg">
            My professional journey in web development, showcasing diverse roles and
            responsibilities across various companies and projects.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative" data-testid="experience-timeline">
          {/* Timeline line */}
          <div className="bg-foreground absolute top-0 bottom-0 left-8 hidden w-1 md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const color = experienceColors[index % experienceColors.length];
              return (
                <motion.div
                  key={index}
                  data-testid={`experience-item-${index}`}
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
                    <div className={`neobrutalist-card ${color} relative z-10 h-8 w-8`} />
                  </div>

                  {/* Content card */}
                  <div className="max-w-2xl flex-1">
                    <div
                      className="neobrutalist-card bg-card space-y-6 p-8"
                      data-testid={`experience-card-${index}`}
                    >
                      {/* Header */}
                      <div className="space-y-3" data-testid={`experience-header-${index}`}>
                        <div className={`neobrutalist-card ${color} inline-block p-2`}>
                          <span className="font-mono text-xs font-black text-white">
                            {exp.period}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h3
                            className="text-2xl font-black"
                            data-testid={`experience-role-${index}`}
                          >
                            {exp.role}
                          </h3>
                          <div className="flex items-center gap-2">
                            <h4
                              className="text-primary text-xl font-bold"
                              data-testid={`experience-company-${index}`}
                            >
                              {exp.company}
                            </h4>
                            {exp.website && (
                              <a
                                href={exp.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary text-sm underline"
                                data-testid={`experience-website-${index}`}
                              >
                                ↗
                              </a>
                            )}
                          </div>
                          <p
                            className="text-muted-foreground text-sm"
                            data-testid={`experience-location-${index}`}
                          >
                            {exp.location}
                          </p>
                        </div>
                      </div>

                      {/* Responsibilities */}
                      <div
                        className="space-y-3"
                        data-testid={`experience-responsibilities-${index}`}
                      >
                        <span className="text-sm font-semibold">KEY RESPONSIBILITIES:</span>
                        <ul className="space-y-2">
                          {exp.responsibilities.map((responsibility, idx) => (
                            <li
                              key={idx}
                              data-testid={`experience-responsibility-${index}-${idx}`}
                              className="flex items-start gap-2 text-sm leading-relaxed"
                            >
                              <span className="text-primary mt-1.5 text-xs">•</span>
                              <span>{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div className="space-y-2" data-testid={`experience-technologies-${index}`}>
                        <span className="text-sm font-semibold">TECHNOLOGIES:</span>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map(tech => (
                            <span
                              key={tech}
                              data-testid={`experience-tech-${index}-${tech.toLowerCase().replace(/\s+/g, '-')}`}
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
