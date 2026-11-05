import Icon from './Icon';

export default function EmptyState({
  icon = 'sparkles',
  title,
  description,
  children,
}) {
  return (
    <div className='empty-state'>
      <span className='empty-icon'>
        <Icon
          name={icon}
          size={28}
        />
      </span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
