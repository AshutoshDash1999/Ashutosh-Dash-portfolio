import { Badge } from "@/components/ui/badge";
import data from "@/lib/data.json";

export default function TechSkills() {
  const { techSkills } = data;

  const categories = Array.from(new Set(techSkills.map((skill) => skill.category)));
  const skillsByCategory = categories.map((category) => ({
    category,
    skills: techSkills.filter((skill) => skill.category === category),
  }));

  return (
    <section
      id="skills"
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <h2 className="text-3xl md:text-4xl font-heading mb-8 md:mb-12">
        Tech Skills
      </h2>
      <div className="space-y-8">
        {skillsByCategory.map(({ category, skills }) => (
          <div key={category}>
            <h3 className="text-xl md:text-2xl font-heading mb-4">
              {category}
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <Badge key={skill.name} variant="default">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
