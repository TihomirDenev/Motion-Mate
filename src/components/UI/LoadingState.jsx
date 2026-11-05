export default function LoadingState({
  label = 'Getting things ready…',
  cards = 3,
}) {
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
