export async function detectLocale(): Promise<string> {
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const storedLocale = localStorage.getItem('NEXT_LOCALE');
    if (storedLocale && ['en', 'fr', 'es'].includes(storedLocale)) {
      return storedLocale;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'fr', 'es'].includes(browserLang)) {
      return browserLang;
    }
  }

  // Default to English
  return 'en';
}
