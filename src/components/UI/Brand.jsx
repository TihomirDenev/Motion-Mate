import { Link } from 'react-router';
import { useTranslation } from '../../i18n/useTranslation';

export default function Brand({ compact = false }) {
  const { t } = useTranslation();
  return (
    <Link
      to='/'
      className='brand'
      aria-label={t('common.brandHome')}
    >
      <span
        className='brand-mark'
        aria-hidden='true'
      >
        <svg
          viewBox='0 0 32 32'
          fill='none'
        >
          <path
            d='m5 22 7-14 4 8 4-8 7 14M10 22l6-12 6 12'
            stroke='currentColor'
            strokeWidth='3.2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </span>
      {!compact && (
        <span>
          motion<span className='brand-dot'>.</span>mate
        </span>
      )}
    </Link>
  );
}
