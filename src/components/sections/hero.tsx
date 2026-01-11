import data from "@/lib/data.json";
import { motion } from "motion/react";

export default function Hero() {
  const { personal } = data;

  return (
    <section id="hero" className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <motion.div
          className="flex-1 space-y-4"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-heading"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            {personal.name}
          </motion.h1>
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-heading text-main"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {personal.title}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            {personal.bio}
          </motion.p>
        </motion.div>
        <motion.div
          className="flex-1 w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <div className="w-full h-full min-h-[400px] md:min-h-[500px] border-2 border-border rounded-base bg-secondary-background">
            {/* 3D Element will be added here */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
