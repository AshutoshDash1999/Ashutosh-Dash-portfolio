import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import data from "@/lib/data.json";

export default function Freelance() {
  const { freelance } = data;

  return (
    <section
      id="freelance"
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <div className="max-w-3xl mx-auto">
        <Card>
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
      </div>
    </section>
  );
}
