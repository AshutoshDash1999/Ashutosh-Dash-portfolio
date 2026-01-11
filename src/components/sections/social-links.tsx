import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import data from "@/lib/data.json";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

export default function SocialLinks() {
  const { socialLinks } = data;

  return (
    <section
      id="contact"
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <h2 className="text-3xl md:text-4xl font-heading mb-8 md:mb-12 text-center">
        Connect With Me
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {socialLinks.map((link) => {
          const Icon = iconMap[link.icon.toLowerCase()] || Mail;
          return (
            <Button
              key={link.platform}
              variant="default"
              size="lg"
              asChild
            >
              <a
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              >
                <Icon className="size-5" />
                {link.platform}
              </a>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
