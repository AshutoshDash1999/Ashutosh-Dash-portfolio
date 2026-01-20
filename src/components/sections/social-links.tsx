import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import data from "@/lib/data.json";
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconBrandX,
    IconMail,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";


const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    github: IconBrandGithub,
    linkedin: IconBrandLinkedin,
    twitter: IconBrandX,
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
        <section id="contact" className="bg-chart-3 border-y-4 border-border px-6 md:px-12 py-16 md:py-24 ">

            <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Card className="hover:shadow-lg transition-shadow duration-300 bg-secondary-background">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl md:text-3xl">
                            {data.freelance.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <p className="text-lg text-foreground">{data.freelance.description}</p>
                        <motion.div
                            className="flex flex-col md:flex-row justify-center gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {socialLinks.map((link) => {
                                const Icon = iconMap[link.icon.toLowerCase()] || IconMail;
                                return (
                                    <motion.div key={link.platform} variants={itemVariants}>
                                        <Button variant="default" size="xl" asChild className="w-full md:w-44">
                                            <Link
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
                                            </Link>
                                        </Button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>


        </section>
    );
}
