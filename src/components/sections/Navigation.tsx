'use client';

import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import Logo from '../ui/Logo';

const navItems = [
  { name: 'HOME', href: '#home' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'FREELANCE', href: '#freelance' },
  { name: 'CONTACT', href: '#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href) || document.querySelector('#home');
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 border-foreground border-b-4 backdrop-blur-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <motion.button
              onClick={() => scrollToSection('#home')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo size="xs" />
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-6 md:flex">
              {navItems.map(item => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm font-black transition-colors ${
                    activeSection === item.href.substring(1)
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-3 md:hidden">
              {/* Mobile menu button */}
              <motion.button
                onClick={toggleMobileMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neobrutalist-card bg-primary text-primary-foreground relative p-3"
                aria-label="Toggle mobile menu"
              >
                <motion.div
                  className="flex h-6 w-6 flex-col justify-center gap-1"
                  animate={isMobileMenuOpen ? 'open' : 'closed'}
                >
                  <motion.div
                    className="h-0.5 w-full origin-center bg-current"
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 6 },
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="h-0.5 w-full bg-current"
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="h-0.5 w-full origin-center bg-current"
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 },
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="bg-background border-foreground fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] overflow-y-auto border-l-4 md:hidden"
            >
              {/* Mobile menu header */}
              <div className="border-foreground flex items-center justify-between border-b-4 p-6">
                <Logo size="xs" />
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="neobrutalist-card bg-destructive text-destructive-foreground p-2"
                >
                  <HugeiconsIcon icon={Cancel01Icon} />
                </motion.button>
              </div>

              {/* Mobile menu items */}
              <div className="space-y-4 p-6">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileTap={{ scale: 0.97 }}
                    className={`neobrutalist-card w-full p-4 text-left transition-all duration-200 ease-out hover:translate-x-2 ${
                      activeSection === item.href.substring(1)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    <span className="text-lg font-black">{item.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Mobile menu footer */}
              <div className="border-foreground mt-auto border-t-4 p-6">
                <div className="neobrutalist-card bg-accent p-4 text-center">
                  <p className="text-accent-foreground font-black">ASHUTOSH DASH</p>
                  <p className="text-accent-foreground/80 font-mono text-sm">Frontend Developer</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
