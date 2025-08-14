'use client';

import {
  Call02Icon,
  Download03Icon,
  GithubIcon,
  Linkedin02Icon,
  Location03Icon,
  Mail01Icon,
  WhatsappIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

const socialLinks = [
  {
    name: 'GitHub',
    icon: GithubIcon,
    url: 'https://github.com/ashutoshdash',
    color: 'bg-foreground text-background',
    hoverColor: 'hover:bg-primary',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin02Icon,
    url: 'https://linkedin.com/in/ashutoshdash',
    color: 'bg-primary text-primary-foreground',
    hoverColor: 'hover:bg-primary-dark',
  },
  {
    name: 'WhatsApp',
    icon: WhatsappIcon,
    url: 'https://wa.me/1234567890',
    color: 'bg-accent text-accent-foreground',
    hoverColor: 'hover:bg-accent/80',
  },
  {
    name: 'Resume',
    icon: Download03Icon,
    url: '/resume.pdf',
    color: 'bg-secondary text-secondary-foreground',
    hoverColor: 'hover:bg-secondary/80',
  },
];

const contactInfo = [
  {
    icon: Mail01Icon,
    label: 'Email',
    value: 'hello@ashutoshdash.dev',
    href: 'mailto:hello@ashutoshdash.dev',
  },
  {
    icon: Call02Icon,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: Location03Icon,
    label: 'Location',
    value: 'San Francisco, CA',
    href: null,
  },
];

export default function ContactSection() {
  return (
    <section className="bg-muted/30 pt-20" id="contact">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl font-black lg:text-7xl">LET&apos;S CONNECT</h2>
          <div className="neobrutalist-card bg-accent inline-block p-4">
            <p className="text-accent-foreground font-mono">
              Ready to collaborate? Let&apos;s make something amazing together
            </p>
          </div>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-black">GET IN TOUCH</h3>

              <p className="text-xl leading-relaxed">
                I&apos;m always excited to work on new projects and collaborate with amazing people.
                Whether you have a project in mind or just want to chat about web development, feel
                free to reach out!
              </p>

              {/* Contact details */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="neobrutalist-card bg-primary p-3">
                      <HugeiconsIcon icon={info.icon} className="text-primary-foreground h-6 w-6" />
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm">{info.label}</label>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="hover:text-primary block text-lg font-medium transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-lg font-medium">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="space-y-4">
              <h4 className="text-xl font-black">FIND ME ONLINE</h4>

              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`neobrutalist-card ${link.color} ${link.hoverColor} ] flex items-center gap-3 p-4`}
                  >
                    <HugeiconsIcon icon={link.icon} className="h-6 w-6" />
                    <span className="font-black">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="neobrutalist-card bg-card p-8"
          >
            <h3 className="mb-6 text-2xl font-black">SEND A MESSAGE</h3>

            <form className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold">
                    NAME
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="neobrutalist-card bg-input-background focus:ring-primary w-full p-4 focus:ring-2 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold">
                    EMAIL
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="neobrutalist-card bg-input-background focus:ring-primary w-full p-4 focus:ring-2 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-bold">
                  SUBJECT
                </label>
                <input
                  id="subject"
                  type="text"
                  className="neobrutalist-card bg-input-background focus:ring-primary w-full p-4 focus:ring-2 focus:outline-none"
                  placeholder="Project inquiry"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold">
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="neobrutalist-card bg-input-background focus:ring-primary w-full resize-none p-4 focus:ring-2 focus:outline-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button className="bg-primary text-primary-foreground w-full p-4 text-lg">
                SEND MESSAGE
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-foreground mt-16 border-t-4 pt-8 text-center"
        >
          <p className="text-lg font-medium">
            © 2025 Ashutosh Dash. Built with React, TypeScript, and lots of ☕
          </p>
          <p className="text-muted-foreground mt-2">
            Designed with neo-brutalism in mind. Bold, functional, and unapologetically different.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
