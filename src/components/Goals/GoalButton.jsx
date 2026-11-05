export default function GoalButton({
  children,
  title = '',
  wide = false,
  primary = true,
  styles = '',
  onClick,
}) {
  const _primaryStyles = primary ? 'btn btn-primary' : 'btn btn-secondary';
  const _wide = wide && 'btn-wide';
  return (
    <button
      type='button'
      className={`${styles} ${_primaryStyles} ${_wide}`}
      onClick={onClick}
    >
      {title || children}
    </button>
  );
}
