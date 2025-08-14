'use client';
import { Linkedin02Icon, StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { ActionIcon } from '../ui/ActionIcon';
import { Button } from '../ui/Button';

const testimonials = [
  {
    name: 'Sarah Johnson',
    company: 'StartupCo',
    text: 'Ashutosh delivered an exceptional website that exceeded our expectations. Professional, creative, and on-time!',
    rating: 5,
    project: 'E-commerce Website',
    color: 'bg-primary',
  },
  {
    name: 'Mike Chen',
    company: 'TechVentures',
    text: 'Outstanding frontend development skills. The user interface is both beautiful and highly functional.',
    rating: 5,
    project: 'Web Application',
    color: 'bg-secondary',
  },
  {
    name: 'Lisa Williams',
    company: 'Creative Agency',
    text: 'Amazing attention to detail and great communication throughout the project. Highly recommended!',
    rating: 5,
    project: 'Portfolio Website',
    color: 'bg-accent',
  },
];

const services = [
  {
    title: 'WEB DEVELOPMENT',
    description: 'Custom websites and web applications built with modern technologies',
    price: 'From $2,000',
    color: 'bg-primary',
  },
  {
    title: 'UI/UX IMPLEMENTATION',
    description: 'Converting designs into pixel-perfect, interactive web interfaces',
    price: 'From $1,500',
    color: 'bg-secondary',
  },
  {
    title: 'PERFORMANCE OPTIMIZATION',
    description: 'Speed up your website and improve user experience',
    price: 'From $800',
    color: 'bg-accent',
  },
  {
    title: 'CONSULTATION',
    description: 'Technical advice and project planning for your next web project',
    price: 'From $100/hr',
    color: 'bg-destructive',
  },
];

export default function FreelanceSection() {
  return (
    <section className="bg-background py-20" id="freelance">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl font-black lg:text-7xl">FREELANCE SERVICES</h2>
          <div className="neobrutalist-card bg-primary inline-block p-4">
            <p className="text-primary-foreground font-mono">
              Let&apos;s work together on your next project
            </p>
          </div>
        </motion.div>

        {/* Services grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="neobrutalist-card bg-card group-hover:bg-muted/50 h-full space-y-4 p-6 transition-all duration-300 ease-in-out">
                {/* Service header */}
                <div className={`neobrutalist-card ${service.color} p-3`}>
                  <h3 className="text-lg font-black text-white">{service.title}</h3>
                </div>

                {/* Description */}
                <p className="text-base leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="mb-8 text-center text-3xl font-black">WHAT CLIENTS SAY</h3>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <div className="neobrutalist-card bg-card space-y-4 p-6 transition-all duration-300 ease-in-out">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <HugeiconsIcon key={i} icon={StarIcon} fill="#fbbf24" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-base leading-relaxed italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Client info */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black">{testimonial.name}</p>
                      <p className="text-muted-foreground text-sm">{testimonial.company}</p>
                    </div>

                    <ActionIcon
                      icon={Linkedin02Icon}
                      className="bg-sky-600 hover:bg-sky-700"
                      iconColor="white"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="neobrutalist-card bg-accent mx-auto max-w-2xl space-y-6 p-8">
            <h3 className="text-accent-foreground text-3xl font-black">
              READY TO START YOUR PROJECT?
            </h3>
            <p className="text-xl">
              Let&apos;s discuss your ideas and bring them to life with cutting-edge web
              development.
            </p>
            <Button className="bg-primary text-primary-foreground px-8 py-4 text-lg">
              GET A QUOTE
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
