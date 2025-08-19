import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Scrolls to a section identified by its ID and focuses it for screen readers.
 *
 * @param {string} sectionId - The ID of the section to scroll to.
 */
export const scrollToSection = (sectionId: string) => {
  const element = document.querySelector(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    // Focus the target section for screen readers
    setTimeout(() => {
      element.setAttribute('tabindex', '-1');
      (element as HTMLElement).focus();
      element.removeAttribute('tabindex');
    }, 500);
  }
};
