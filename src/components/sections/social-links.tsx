import { Button } from "@/components/ui/button";
import data from "@/lib/data.json";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
} from "@tabler/icons-react";
import { motion } from "motion/react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  twitter: IconBrandTwitter,
  mail: IconMail,
};

export default function SocialLinks() {
  const { socialLinks } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section id="contact" className="container mx-auto px-12 py-16 md:py-24 ">
      <motion.h2
        className="text-3xl md:text-4xl font-heading mb-8 md:mb-12"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
      >
        Connect With Me
      </motion.h2>
      <motion.div
        className="flex flex-wrap justify-center gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {socialLinks.map((link) => {
          const Icon = iconMap[link.icon.toLowerCase()] || IconMail;
          return (
            <motion.div key={link.platform} variants={itemVariants}>
              <Button variant="default" size="lg" asChild>
                <a
                  href={link.url}
                  target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    link.url.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                >
                  <Icon className="size-5" />
                  {link.platform}
                </a>
              </Button>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
