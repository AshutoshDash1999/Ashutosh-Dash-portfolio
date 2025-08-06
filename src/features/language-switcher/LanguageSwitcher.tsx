"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";

const LOCALES = ["en", "fr", "es"] as const;
type Locale = (typeof LOCALES)[number];

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    router.push(`/${locale}`);
  };

  if (!mounted) return null;

  return (
    <div className="flex gap-2">
      {LOCALES.map((locale) => (
        <Button
          key={locale}
          variant={locale === currentLocale ? "primary" : "outline"}
          onClick={() => handleLanguageChange(locale)}
          className="uppercase"
        >
          {locale}
        </Button>
      ))}
    </div>
  );
}

export { LanguageSwitcher };
