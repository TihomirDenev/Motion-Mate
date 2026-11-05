import { useTranslation } from '../../i18n/useTranslation';

export default function LoadingState({ label, cards = 3 }) {
  const { t } = useTranslation();
  label ||= t('common.loading');
  return (
    <div
      className='loading-state'
      role='status'
      aria-label={label}
    >
      <span className='sr-only'>{label}</span>
      <div className='skeleton skeleton-heading' />
      <div className='card-grid'>
        {Array.from({ length: cards }, (_, i) => (
          <div
            key={i}
            className='skeleton skeleton-card'
          />
        ))}
      </div>
    </div>
  );
}
