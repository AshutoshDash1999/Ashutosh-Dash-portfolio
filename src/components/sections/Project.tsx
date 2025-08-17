'use client';

import { Github01Icon, LinkSquare01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import ImageWithFallback from '../ui/ImageWithFallback';
import Link from 'next/link';
import projectsData from '../../data/projects.json';

// Color mapping for projects
const projectColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-destructive'];

export default function Projects() {
  return (
    <section className="bg-muted/30 py-20" id="projects">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl font-black lg:text-7xl">FEATURED PROJECTS</h2>
          <div className="neobrutalist-card bg-destructive inline-block p-4">
            <p className="text-destructive-foreground font-mono">
              Showcasing my best work and creative solutions
            </p>
          </div>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            Explore a collection of my most impactful projects, demonstrating expertise in modern
            web technologies and creative problem-solving.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projectsData.map((project, index) => {
            const projectColor = projectColors[index % projectColors.length];
            const hasLiveLink = 'live' in project.links;
            const hasChromeStore = 'chrome_store' in project.links;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="neobrutalist-card bg-card overflow-hidden">
                  {/* Project image placeholder */}
                  <div className="relative overflow-hidden">
                    {project?.image && (
                      <ImageWithFallback
                        src={project.image}
                        alt={project.name}
                        width={500}
                        height={300}
                        fill
                        className="h-48 w-full transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}

                    <div className="bg-foreground/80 absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {hasLiveLink && (
                        <motion.a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neobrutalist-button bg-primary text-primary-foreground p-3"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <HugeiconsIcon icon={LinkSquare01Icon} />
                        </motion.a>
                      )}
                      {hasChromeStore && (
                        <motion.a
                          href={project.links.chrome_store}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neobrutalist-button bg-accent text-accent-foreground p-3"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <HugeiconsIcon icon={LinkSquare01Icon} />
                        </motion.a>
                      )}
                      <motion.a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neobrutalist-button bg-secondary text-secondary-foreground p-3"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <HugeiconsIcon icon={Github01Icon} />
                      </motion.a>
                    </div>
                  </div>

                  {/* Project info */}
                  <div className="space-y-4 p-6">
                    {/* Title and color indicator */}
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="group-hover:text-primary text-xl font-black transition-colors">
                        {project.name}
                      </h3>
                      <div className={`h-4 w-4 ${projectColor} flex-shrink-0`} />
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="space-y-2">
                      <span className="text-xs">TECH STACK:</span>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map(tech => (
                          <span
                            key={tech}
                            className="neobrutalist-card bg-muted text-muted-foreground px-2 py-1 font-mono text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-2 pt-2">
                      {hasLiveLink && project.links.live && (
                        <Link
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neobrutalist-button bg-primary text-primary-foreground flex-1 px-4 py-2 text-center text-sm"
                        >
                          LIVE SITE
                        </Link>
                      )}
                      {hasChromeStore && project.links.chrome_store && (
                        <Link
                          href={project.links.chrome_store}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neobrutalist-button bg-accent text-accent-foreground flex-1 px-4 py-2 text-center text-sm"
                        >
                          CHROME STORE
                        </Link>
                      )}
                      {project.links.github && (
                        <Link
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neobrutalist-button bg-foreground text-background flex-1 px-4 py-2 text-center text-sm"
                        >
                          CODE
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View more button
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="neobrutalist-button bg-accent text-accent-foreground px-8 py-4 text-lg">
            VIEW ALL PROJECTS
          </button>
        </motion.div> */}
      </div>
    </section>
  );
}
