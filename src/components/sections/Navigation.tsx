'use client';

import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Logo from '../ui/Logo';

const navItems = [
  { name: 'HOME', href: '#hero', description: 'Go to home section' },
  { name: 'EXPERIENCE', href: '#experience', description: 'View work experience' },
  { name: 'SKILLS', href: '#skills', description: 'View technical skills' },
  { name: 'PROJECTS', href: '#projects', description: 'Browse portfolio projects' },
  { name: 'FREELANCE', href: '#freelance', description: 'Learn about freelance services' },
  { name: 'CONTACT', href: '#contact', description: 'Get in touch' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

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
        mobileMenuButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href) || document.querySelector('#home');
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);

    // Focus the target section for screen readers
    setTimeout(() => {
      element?.setAttribute('tabindex', '-1');
      (element as HTMLElement)?.focus();
      element?.removeAttribute('tabindex');
    }, 500);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <>
      <motion.nav
        id="navigation"
        data-testid="navigation"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 border-foreground border-b-4 backdrop-blur-sm'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <motion.button
              data-testid="logo-button"
              onClick={() => scrollToSection('#home')}
              onKeyDown={e => handleKeyDown(e, () => scrollToSection('#home'))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go to home page"
            >
              <Logo size="sm" />
            </motion.button>

            {/* Desktop Navigation */}
            <div
              className="hidden items-center gap-6 md:flex"
              role="menubar"
              data-testid="desktop-navigation"
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  data-testid={`nav-item-${item.href.substring(1)}`}
                  onClick={() => scrollToSection(item.href)}
                  onKeyDown={e => handleKeyDown(e, () => scrollToSection(item.href))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm font-black transition-all duration-300 ${
                    activeSection === item.href.substring(1)
                      ? 'text-primary border-primary -translate-x-1 -translate-y-1 border-4 shadow-[8px_8px_0px_#000000]'
                      : 'text-foreground hover:text-primary hover:border-primary hover:-translate-x-1 hover:-translate-y-1 hover:border-4 hover:shadow-[8px_8px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-[4px_4px_0px_#000000]'
                  }`}
                  role="menuitem"
                  aria-label={item.description}
                  aria-current={activeSection === item.href.substring(1) ? 'page' : undefined}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-3 md:hidden" data-testid="mobile-controls">
              {/* Mobile menu button */}
              <motion.button
                ref={mobileMenuButtonRef}
                data-testid="mobile-menu-button"
                onClick={toggleMobileMenu}
                onKeyDown={e => handleKeyDown(e, toggleMobileMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neobrutalist-card bg-primary text-primary-foreground focus:ring-primary focus:ring-offset-background relative rounded p-3 focus:ring-4 focus:ring-offset-2 focus:outline-none"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-haspopup="true"
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
              ref={mobileMenuRef}
              id="mobile-menu"
              data-testid="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="bg-background border-foreground fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] overflow-y-auto border-l-4 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              {/* Mobile menu header */}
              <div className="border-foreground flex items-center justify-between border-b-4 p-6">
                <Logo size="sm" />
                <motion.button
                  data-testid="close-mobile-menu-button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  onKeyDown={e => handleKeyDown(e, () => setIsMobileMenuOpen(false))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="neobrutalist-card bg-destructive text-destructive-foreground focus:ring-destructive focus:ring-offset-background rounded p-2 focus:ring-4 focus:ring-offset-2 focus:outline-none"
                  aria-label="Close mobile menu"
                >
                  <HugeiconsIcon icon={Cancel01Icon} />
                </motion.button>
              </div>
              {/* Mobile menu items */}
              <nav
                className="space-y-4 p-6"
                role="navigation"
                aria-label="Mobile navigation"
                data-testid="mobile-navigation"
              >
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    data-testid={`mobile-nav-item-${item.href.substring(1)}`}
                    onClick={() => scrollToSection(item.href)}
                    onKeyDown={e => handleKeyDown(e, () => scrollToSection(item.href))}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileTap={{ scale: 0.97 }}
                    className={`neobrutalist-card focus:ring-primary focus:ring-offset-background w-full rounded p-4 text-left transition-all duration-200 ease-out hover:translate-x-2 focus:ring-4 focus:ring-offset-2 focus:outline-none ${
                      activeSection === item.href.substring(1)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-primary hover:text-primary-foreground'
                    }`}
                    aria-label={item.description}
                    aria-current={activeSection === item.href.substring(1) ? 'page' : undefined}
                  >
                    <span className="text-lg font-black">{item.name}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Mobile menu footer */}
              {/* <div className="border-foreground mt-auto border-t-4 p-6">
               
              </div> */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
