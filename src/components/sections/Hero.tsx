'use client';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { scrollToSection } from '@/lib/utils';

const Hero = () => {
  return (
    <section
      className="bg-background relative flex items-center justify-center overflow-hidden py-2"
      id="hero"
      data-testid="hero-section"
      role="banner"
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
        {/* Left content */}
        <motion.div
          data-testid="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div>
            <motion.h1
              id="hero-heading"
              data-testid="hero-name"
              className="text-6xl font-black tracking-tighter text-purple-950 lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ASHUTOSH
            </motion.h1>
            <motion.h1
              data-testid="hero-surname"
              className="text-primary text-6xl font-black tracking-tighter lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              DASH
            </motion.h1>
          </div>

          {/* Professional Title */}
          <motion.div
            data-testid="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="neobrutalist-card bg-yellow-300 p-6"
            role="contentinfo"
            aria-label="Professional title and expertise"
          >
            <h2 className="text-secondary-foreground text-2xl font-black lg:text-4xl">
              FRONTEND DEVELOPER
            </h2>
            <h2 className="text-secondary-foreground text-2xl font-black lg:text-4xl">
              & FREELANCER
            </h2>
          </motion.div>

          {/* Mission statement */}
          <motion.div
            data-testid="hero-mission"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <p className="text-xl font-medium lg:text-2xl">
              Crafting bold, interactive web experiences with precision and creativity.
            </p>
            <p className="text-muted-foreground text-lg">
              Specializing in React, Next.js, TypeScript, and modern web technologies to build
              exceptional user experiences.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            data-testid="hero-cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4"
            role="group"
            aria-label="Call to action buttons"
          >
            <Button
              data-testid="view-work-button"
              className="bg-primary focus:ring-primary focus:ring-offset-background rounded text-white focus:ring-4 focus:ring-offset-2 focus:outline-none"
              onClick={() => scrollToSection('#projects')}
              aria-label="View my portfolio projects and work samples"
            >
              VIEW MY WORK
            </Button>
            <Button
              data-testid="get-in-touch-button"
              className="bg-accent focus:ring-accent focus:ring-offset-background rounded focus:ring-4 focus:ring-offset-2 focus:outline-none"
              onClick={() => scrollToSection('#contact')}
              aria-label="Get in touch to discuss your project requirements"
            >
              GET IN TOUCH
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;
