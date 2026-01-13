import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import data from "@/lib/data.json";
import { motion } from "motion/react";

export default function Experience() {
  const { experience } = data;

  return (
    <section
      id="experience"
      className="px-12 py-16 md:py-24 bg-chart-2 border-y-4 border-border"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-heading mb-8 md:mb-12"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        Experience
      </motion.h2>
      <div className="space-y-6">
        {experience.map((exp) => (
          <motion.div
            key={`${exp.company}-${exp.role}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">{exp.role}</CardTitle>
                <div className="text-lg text-foreground">
                  {exp.company} · {exp.duration}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} variant="chart3">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
