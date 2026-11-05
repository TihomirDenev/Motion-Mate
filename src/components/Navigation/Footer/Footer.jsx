import { Link } from 'react-router';
import { useTranslation } from '../../../i18n/useTranslation';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className='app-footer'>
      <p>
        © {new Date().getFullYear()} Motion Mate <span>·</span>{' '}
        {t('footer.tagline')}
      </p>
      <nav aria-label={t('footer.navigation')}>
        <Link to='/about'>{t('footer.story')}</Link>
        <Link to='/contact-us'>{t('footer.contact')}</Link>
        <a
          href='https://github.com/TihomirDenev/Motion-Mate'
          target='_blank'
          rel='noreferrer'
        >
          GitHub ↗
        </a>
      </nav>
    </footer>
  );
};
