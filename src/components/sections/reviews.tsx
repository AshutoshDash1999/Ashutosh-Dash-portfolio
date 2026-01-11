import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import data from "@/lib/data.json";
import { motion } from "motion/react";

export default function Reviews() {
  const { reviews } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section id="reviews" className="container mx-auto px-4 py-16 md:py-24">
      <motion.h2
        className="text-3xl md:text-4xl font-heading mb-8 md:mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        Reviews
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {reviews.map((review, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl">{review.clientName}</CardTitle>
                <div className="text-sm text-foreground">{review.role}</div>
                {review.rating && (
                  <div className="text-main">{"★".repeat(review.rating)}</div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-foreground italic">"{review.review}"</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
