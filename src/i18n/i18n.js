import en from './en.js';
import bg from './bg.js';

export const LANGUAGES = {
  en: { short: 'EN', name: 'English', locale: 'en-GB' },
  bg: { short: 'BG', name: 'Български', locale: 'bg-BG' },
};

export const dictionaries = { en, bg };
const STORAGE_KEY = 'language';

const lookup = (dictionary, key) =>
  key.split('.').reduce((node, part) => node?.[part], dictionary);

function detectLanguage() {
  try {
    const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (dictionaries[saved]) return saved;
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  return globalThis.navigator?.language?.toLowerCase().startsWith('bg')
    ? 'bg'
    : 'en';
}

let currentLanguage = detectLanguage();

export const getLanguage = () => currentLanguage;
export const getLocale = (language = currentLanguage) =>
  LANGUAGES[language].locale;

export function setCurrentLanguage(language) {
  if (!dictionaries[language]) return;
  currentLanguage = language;
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, language);
  } catch {
    /* The selected language still applies for this visit. */
  }
  if (typeof document !== 'undefined') document.documentElement.lang = language;
}

export function translate(key, values = {}, language = currentLanguage) {
  const template = lookup(dictionaries[language], key) ?? lookup(en, key);
  if (template === undefined) return key;
  if (typeof template === 'function') return template(values);
  if (typeof template !== 'string') return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    values[name] === undefined ? match : String(values[name])
  );
}

export function translateEntry(group, value, language = currentLanguage) {
  if (!value) return value;
  return dictionaries[language][group]?.[value] ?? en[group]?.[value] ?? value;
}

export const formatNumber = (value, options, language = currentLanguage) =>
  new Intl.NumberFormat(getLocale(language), options).format(
    Number(value) || 0
  );

export const formatDate = (value, options, language = currentLanguage) =>
  new Date(value).toLocaleDateString(getLocale(language), options);
