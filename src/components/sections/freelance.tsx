import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import data from "@/lib/data.json";

export default function Freelance() {
  const { freelance } = data;

  return (
    <section
      id="freelance"
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">
              {freelance.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg text-foreground">{freelance.description}</p>
            <Button
              variant="default"
              size="lg"
              asChild
            >
              <a href="#contact">Get in Touch</a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
