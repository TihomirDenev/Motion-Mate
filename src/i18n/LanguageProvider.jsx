import { useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { LanguageContext } from './LanguageContext';
import {
  LANGUAGES,
  formatDate,
  formatNumber,
  getLanguage,
  getLocale,
  setCurrentLanguage,
  translate,
  translateEntry,
} from './i18n';

export default function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const setLanguage = (next) => {
      if (next === language || !LANGUAGES[next]) return;
      const apply = () => {
        setCurrentLanguage(next);
        setLanguageState(next);
      };
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (document.startViewTransition && !reduceMotion)
        document.startViewTransition(() => flushSync(apply));
      else apply();
    };
    return {
      language,
      languages: LANGUAGES,
      locale: getLocale(language),
      setLanguage,
      t: (key, values) => translate(key, values, language),
      te: (group, entry) => translateEntry(group, entry, language),
      formatNumber: (number, options) =>
        formatNumber(number, options, language),
      formatDate: (date, options) => formatDate(date, options, language),
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
