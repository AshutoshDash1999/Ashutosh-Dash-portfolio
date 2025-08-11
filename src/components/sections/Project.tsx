'use client';

import { Github01Icon, LinkSquare01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import ImageWithFallback from '../ui/ImageWithFallback';

const projects = [
  {
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce solution with modern design, payment integration, and admin dashboard.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: '',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ashutoshdash',
    color: 'bg-primary',
  },
  {
    title: 'Task Management App',
    description:
      'Collaborative task management tool with real-time updates, drag-and-drop functionality, and team features.',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind'],
    image: '',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ashutoshdash',
    color: 'bg-secondary',
  },
  {
    title: 'Portfolio Website',
    description:
      'A creative portfolio website with 3D animations, smooth transitions, and responsive design.',
    technologies: ['React', 'Framer Motion', 'Tailwind', 'Three.js'],
    image: '',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ashutoshdash',
    color: 'bg-accent',
  },
  {
    title: 'Weather Dashboard',
    description:
      'Real-time weather application with beautiful visualizations, forecasts, and location-based data.',
    technologies: ['Vue.js', 'Chart.js', 'OpenWeather API', 'CSS Grid'],
    image: '',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ashutoshdash',
    color: 'bg-destructive',
  },
  {
    title: 'Social Media App',
    description:
      'A modern social media platform with real-time messaging, content sharing, and user interactions.',
    technologies: ['React Native', 'Firebase', 'Redux', 'Socket.io'],
    image: '',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ashutoshdash',
    color: 'bg-primary',
  },
  {
    title: 'Learning Platform',
    description:
      'Educational platform with video courses, progress tracking, and interactive quizzes for students.',
    technologies: ['Angular', 'NestJS', 'PostgreSQL', 'AWS'],
    image: '',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ashutoshdash',
    color: 'bg-accent',
  },
];

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
        </motion.div>

        {/* Projects grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="neobrutalist-card bg-card overflow-hidden">
                {/* Project image */}
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="h-48 w-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="bg-foreground/80 absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neobrutalist-button bg-primary text-primary-foreground p-3"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <HugeiconsIcon icon={LinkSquare01Icon} />
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
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
                      {project.title}
                    </h3>
                    <div className={`h-4 w-4 ${project.color} flex-shrink-0`} />
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-base leading-relaxed">
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
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neobrutalist-button bg-primary text-primary-foreground flex-1 px-4 py-2 text-center text-sm"
                    >
                      LIVE SITE
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neobrutalist-button bg-foreground text-background flex-1 px-4 py-2 text-center text-sm"
                    >
                      CODE
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
