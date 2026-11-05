import Icon from './Icon';

export default function InlineMessage({ children, type = 'error' }) {
  if (!children) return null;
  return (
    <div
      className={`inline-message message-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <Icon
        name={type === 'success' ? 'check' : 'info'}
        size={18}
      />
      <span>{children}</span>
    </div>
  );
}
