import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-20 text-center"
    >
      <h1 className="text-5xl md:text-7xl font-bold mb-6">{t("title")}</h1>
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {t("subtitle")}
      </p>
    </motion.section>
  );
}
