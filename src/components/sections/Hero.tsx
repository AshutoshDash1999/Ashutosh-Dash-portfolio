'use client';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

const Hero = () => {
  return (
    <section className="bg-background relative flex items-center justify-center overflow-hidden py-10">
      <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div>
            <motion.h1
              className="text-6xl font-black tracking-tighter text-purple-950 lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ASHUTOSH
            </motion.h1>
            <motion.h1
              className="text-primary text-6xl font-black tracking-tighter lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              DASH
            </motion.h1>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="neobrutalist-card bg-yellow-300 p-6"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <p className="text-xl font-medium lg:text-2xl">
              Crafting bold, interactive web experiences with precision and creativity.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <Button color="purple">VIEW MY WORK</Button>
            <Button color="emerald">GET IN TOUCH</Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;
