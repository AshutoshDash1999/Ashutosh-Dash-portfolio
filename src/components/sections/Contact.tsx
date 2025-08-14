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
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm, type ContactFormState } from '../../lib/actions/contact';
import { Button } from '../ui/Button';

const socialLinks = [
  {
    name: 'GitHub',
    icon: GithubIcon,
    url: 'https://github.com/ashutoshdash',
    color: 'bg-foreground text-background',
    hoverColor: 'hover:bg-primary',
    description: 'Visit my GitHub profile to see my open source contributions',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin02Icon,
    url: 'https://linkedin.com/in/ashutoshdash',
    color: 'bg-primary text-primary-foreground',
    hoverColor: 'hover:bg-primary-dark',
    description: 'Connect with me on LinkedIn for professional networking',
  },
  {
    name: 'WhatsApp',
    icon: WhatsappIcon,
    url: 'https://wa.me/1234567890',
    color: 'bg-accent text-accent-foreground',
    hoverColor: 'hover:bg-accent/80',
    description: 'Contact me directly on WhatsApp for quick communication',
  },
  {
    name: 'Resume',
    icon: Download03Icon,
    url: '/resume.pdf',
    color: 'bg-secondary text-secondary-foreground',
    hoverColor: 'hover:bg-secondary/80',
    description: 'Download my resume in PDF format',
  },
];

const contactInfo = [
  {
    icon: Mail01Icon,
    label: 'Email',
    value: 'hello@ashutoshdash.dev',
    href: 'mailto:hello@ashutoshdash.dev',
    description: 'Send me an email at hello@ashutoshdash.dev',
  },
  {
    icon: Call02Icon,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
    description: 'Call me at +1 (555) 123-4567',
  },
  {
    icon: Location03Icon,
    label: 'Location',
    value: 'San Francisco, CA',
    href: null,
    description: 'I am located in San Francisco, California',
  },
];

export default function ContactSection() {
  const initialState: ContactFormState = {
    errors: {},
    message: null,
    success: false,
  };

  const [state, formAction] = useActionState(submitContactForm, initialState);

  // Custom submit button component that shows loading state
  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        type="submit"
        className="bg-primary text-primary-foreground focus:ring-primary focus:ring-offset-background w-full rounded p-4 text-lg focus:ring-4 focus:ring-offset-2 focus:outline-none"
        disabled={pending}
        aria-describedby={pending ? 'submitting-status' : undefined}
      >
        {pending ? 'SENDING...' : 'SEND MESSAGE'}
      </Button>
    );
  }

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
          <div className="neobrutalist-card bg-secondary inline-block p-4">
            <p className="text-accent-foreground font-mono">
              Ready to collaborate? Let&apos;s make something amazing together
            </p>
          </div>
          <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg">
            Ready to start your next web project? I&apos;m here to help bring your ideas to life
            with professional web development services and creative solutions.
          </p>
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
              <div className="space-y-4" role="list" aria-label="Contact information">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                    role="listitem"
                  >
                    <div className="neobrutalist-card bg-primary p-3" aria-hidden="true">
                      <HugeiconsIcon icon={info.icon} className="text-primary-foreground h-6 w-6" />
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        {info.label}
                      </label>
                      {info.href ? (
                        <Link
                          href={info.href}
                          className="hover:text-primary focus:ring-primary focus:ring-offset-background block rounded text-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                          aria-label={info.description}
                        >
                          {info.value}
                        </Link>
                      ) : (
                        <p className="text-lg font-medium" aria-label={info.description}>
                          {info.value}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="space-y-4">
              <h4 className="text-xl font-black">FIND ME ONLINE</h4>

              <div
                className="grid grid-cols-2 gap-4"
                role="list"
                aria-label="Social media and professional links"
              >
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
                    className={`neobrutalist-card ${link.color} ${link.hoverColor} focus:ring-primary focus:ring-offset-background flex items-center gap-3 rounded p-4 focus:ring-2 focus:ring-offset-2 focus:outline-none`}
                    aria-label={link.description}
                    role="listitem"
                  >
                    <HugeiconsIcon icon={link.icon} className="h-6 w-6" aria-hidden="true" />
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

            {/* Form status messages */}
            {state.success && state.message && (
              <div
                className="mb-6 rounded border-2 border-green-600 bg-green-100 p-4 text-green-800"
                role="alert"
                aria-live="polite"
              >
                <p className="font-medium">{state.message}</p>
              </div>
            )}

            {!state.success && state.message && (
              <div
                className="mb-6 rounded border-2 border-red-600 bg-red-100 p-4 text-red-800"
                role="alert"
                aria-live="polite"
              >
                <p className="font-medium">{state.message}</p>
              </div>
            )}

            {state.errors?._form && (
              <div
                className="mb-6 rounded border-2 border-red-600 bg-red-100 p-4 text-red-800"
                role="alert"
                aria-live="polite"
              >
                <p className="font-medium">{state.errors._form.join(', ')}</p>
              </div>
            )}

            <form className="space-y-6" action={formAction} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold">
                    NAME{' '}
                    <span className="text-destructive" aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`neobrutalist-card bg-input-background focus:ring-offset-background w-full rounded p-4 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                      state.errors?.name ? 'ring-destructive ring-2' : 'focus:ring-primary'
                    }`}
                    placeholder="Your name"
                    aria-describedby={state.errors?.name ? 'name-error' : undefined}
                    aria-invalid={!!state.errors?.name}
                    required
                  />
                  {state.errors?.name && (
                    <p id="name-error" className="text-destructive text-sm" role="alert">
                      {state.errors.name.join(', ')}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold">
                    EMAIL{' '}
                    <span className="text-destructive" aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`neobrutalist-card bg-input-background focus:ring-offset-background w-full rounded p-4 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                      state.errors?.email ? 'ring-destructive ring-2' : 'focus:ring-primary'
                    }`}
                    placeholder="your@email.com"
                    aria-describedby={state.errors?.email ? 'email-error' : undefined}
                    aria-invalid={!!state.errors?.email}
                    required
                  />
                  {state.errors?.email && (
                    <p id="email-error" className="text-destructive text-sm" role="alert">
                      {state.errors.email.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-bold">
                  SUBJECT{' '}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className={`neobrutalist-card bg-input-background focus:ring-offset-background w-full rounded p-4 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                    state.errors?.subject ? 'ring-destructive ring-2' : 'focus:ring-primary'
                  }`}
                  placeholder="Project inquiry"
                  aria-describedby={state.errors?.subject ? 'subject-error' : undefined}
                  aria-invalid={!!state.errors?.subject}
                  required
                />
                {state.errors?.subject && (
                  <p id="subject-error" className="text-destructive text-sm" role="alert">
                    {state.errors.subject.join(', ')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold">
                  MESSAGE{' '}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className={`neobrutalist-card bg-input-background focus:ring-offset-background w-full resize-none rounded p-4 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                    state.errors?.message ? 'ring-destructive ring-2' : 'focus:ring-primary'
                  }`}
                  placeholder="Tell me about your project..."
                  aria-describedby={state.errors?.message ? 'message-error' : undefined}
                  aria-invalid={!!state.errors?.message}
                  required
                />
                {state.errors?.message && (
                  <p id="message-error" className="text-destructive text-sm" role="alert">
                    {state.errors.message.join(', ')}
                  </p>
                )}
              </div>

              <SubmitButton />

              <p
                id="submitting-status"
                className="text-muted-foreground text-center"
                aria-live="polite"
              >
                Form will be processed using server actions
              </p>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-foreground mt-16 border-t-4 p-8 text-center"
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
