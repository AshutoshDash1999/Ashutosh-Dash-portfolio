"use client";

import { motion } from "motion/react";

export default function Footer() {
  return (
    <motion.footer
      className="border-t-4 border-border py-8 md:py-8"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="px-6 md:px-12">
        <div className="text-center text-foreground">
          <p className="text-base md:text-base">
            © {new Date().getFullYear()} Ashutosh Dash. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
