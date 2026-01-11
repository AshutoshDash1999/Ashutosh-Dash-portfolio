import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import data from "@/lib/data.json";

export default function Experience() {
  const { experience } = data;

  return (
    <section
      id="experience"
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <h2 className="text-3xl md:text-4xl font-heading mb-8 md:mb-12">
        Experience
      </h2>
      <div className="space-y-6">
        {experience.map((exp, index) => (
          <Card key={index}>
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
                  <Badge key={tech} variant="neutral">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
