'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SmartPhone02Icon } from '@hugeicons/core-free-icons';

// Define proper types for PWA installation
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    const navigator = window.navigator as NavigatorStandalone;

    if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) {
      setShowInstallButton(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }

    setDeferredPrompt(null);
  };

  if (!showInstallButton) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
      data-testid="pwa-install-container"
    >
      <button
        data-testid="pwa-install-button"
        onClick={handleInstallClick}
        className="neobrutalist-card bg-muted/50 hover:bg-muted/70 text-muted-foreground hover:text-foreground focus:ring-primary mt-4 inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label="Install this app on your device"
      >
        <HugeiconsIcon icon={SmartPhone02Icon} />
        Install App
      </button>
    </motion.div>
  );
}
