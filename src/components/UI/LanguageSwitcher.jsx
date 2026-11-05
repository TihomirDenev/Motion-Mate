import { useTranslation } from '../../i18n/useTranslation';

export default function LanguageSwitcher() {
  const { language, languages, setLanguage, t } = useTranslation();
  const next = language === 'bg' ? 'en' : 'bg';
  return (
    <button
      type='button'
      className='language-button'
      lang={next}
      aria-label={t('language.switchTo', { language: languages[next].name })}
      title={languages[next].name}
      onClick={() => setLanguage(next)}
    >
      <span aria-hidden='true'>{languages[next].short}</span>
    </button>
  );
}
