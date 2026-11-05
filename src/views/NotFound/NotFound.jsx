import { Link } from 'react-router';
import { usePageTitle } from '../../hooks/usePageTitle';
import Icon from '../../components/UI/Icon';
import { useTranslation } from '../../i18n/useTranslation';

export default function NotFound() {
  const { t } = useTranslation();
  usePageTitle(`Motion Mate | ${t('notFound.pageTitle')}`);
  return (
    <section className='not-found page-enter'>
      <span
        className='not-found-art'
        aria-hidden='true'
      >
        <Icon
          name='activity'
          size={65}
        />
      </span>
      <p className='eyebrow'>{t('notFound.eyebrow')}</p>
      <h1>
        {t('notFound.titleLine1')}
        <br />
        {t('notFound.titleLine2')}
      </h1>
      <p>
        {t('notFound.textLine1')}
        <br />
        {t('notFound.textLine2')}
      </p>
      <Link
        className='btn btn-primary'
        to='/'
      >
        {t('notFound.back')}{' '}
        <Icon
          name='arrow'
          size={17}
        />
      </Link>
    </section>
  );
}
