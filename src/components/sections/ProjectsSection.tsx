import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import projects from "../../data/projects.json";
import Card from "../ui/Card";

export default function ProjectsSection() {
  const t = useTranslations("projects");

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-12 text-center">{t("title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project: any) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="hover">
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
