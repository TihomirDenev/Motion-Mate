export default function Progress({ progress = 0 }) {
  const value = Math.max(0, Math.min(100, Number(progress) || 0));
  return (
    <span
      className='progress-ring'
      role='progressbar'
      aria-label='Goal progress'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <svg
        viewBox='0 0 56 56'
        aria-hidden='true'
      >
        <circle
          className='progress-track'
          cx='28'
          cy='28'
          r='23'
        />
        <circle
          className='progress-value'
          cx='28'
          cy='28'
          r='23'
          strokeDasharray='144.51'
          strokeDashoffset={144.51 * (1 - value / 100)}
        />
      </svg>
      <strong>{Math.round(value)}%</strong>
    </span>
  );
}
