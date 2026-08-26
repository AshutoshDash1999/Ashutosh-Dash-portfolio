"use client";

import { motion } from "motion/react";

export function InsightsContent() {
  return (
    <section className="px-6 md:px-12 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-heading mb-2">
          Site Insights
        </h1>
        <p className="text-foreground/70">Dashboard is being reworked.</p>
      </motion.div>
    </section>
  );
}
